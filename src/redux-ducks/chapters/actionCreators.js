// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import { handleHTMLError } from "redux-ducks/utils";
import { selectChaptersForManga } from ".";
import {
  FETCH_CACHE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  UPDATE_REQUEST,
  UPDATE_FAILURE,
  UPDATE_SUCCESS
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
// Fetch the chapters that are currently cached by the server
type Obj = { ignoreCache?: boolean };
export function fetchChapters(
  mangaId: number,
  { ignoreCache = false }: Obj = {}
): ThunkAction {
  return (dispatch, getState) => {
    // Return manga's cached chapters if they're already in the store
    if (
      !ignoreCache &&
      selectChaptersForManga(getState(), mangaId).length > 0
    ) {
      return Promise.resolve().then(dispatch({ type: FETCH_CACHE }));
    }

    dispatch({ type: FETCH_REQUEST, meta: { mangaId } });

    return fetch(Server.chapters(mangaId))
      .then(handleHTMLError)
      .then(
        json =>
          dispatch({ type: FETCH_SUCCESS, payload: json.content, mangaId }),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: "Failed to load chapters",
            meta: { error }
          })
      );
  };
}

// Request the server to re-scrape the source site for chapters
// If there have been any changes, re-fetch the cached chapter list from the server
export function updateChapters(mangaId: number): ThunkAction {
  return dispatch => {
    dispatch({ type: UPDATE_REQUEST, meta: { mangaId } });

    return fetch(Server.updateMangaChapters(mangaId))
      .then(handleHTMLError)
      .then(
        json => {
          if (!json.success) {
            return dispatch({
              type: UPDATE_FAILURE,
              errorMessage: "Failed to update the chapters list",
              meta: { json }
            });
          }

          if (json.added.length > 0 || json.removed.length > 0) {
            dispatch({ type: UPDATE_SUCCESS, meta: { json } });
            return dispatch(fetchChapters(mangaId, { ignoreCache: true }));
          }

          return dispatch({
            type: UPDATE_SUCCESS,
            meta: { note: "No updates", json }
          });
        },
        error =>
          dispatch({
            type: UPDATE_FAILURE,
            errorMessage: "Failed to update the chapters list",
            meta: { error }
          })
      );
  };
}
