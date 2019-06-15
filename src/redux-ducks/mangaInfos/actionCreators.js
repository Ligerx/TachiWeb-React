// @flow
import { Server } from "api";
import { handleHTMLError } from "redux-ducks/utils";
import type { ThunkAction } from "redux-ducks/reducers";
import { selectShouldReloadLibrary } from "redux-ducks/library";
import {
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES
} from "redux-ducks/library/actions";
import { selectMangaFlagValue } from ".";
import {
  FETCH_MANGA_CACHE,
  FETCH_MANGA_REQUEST,
  FETCH_MANGA_SUCCESS,
  FETCH_MANGA_FAILURE,
  UPDATE_MANGA_REQUEST,
  UPDATE_MANGA_SUCCESS,
  UPDATE_MANGA_FAILURE,
  TOGGLE_FAVORITE_REQUEST,
  TOGGLE_FAVORITE_SUCCESS,
  TOGGLE_FAVORITE_FAILURE,
  SET_FLAG_NO_CHANGE,
  SET_FLAG_REQUEST,
  SET_FLAG_SUCCESS,
  SET_FLAG_FAILURE
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
type FetchOptions = { ignoreCache?: boolean };
export function fetchMangaInfo(
  mangaId: number,
  { ignoreCache = false }: FetchOptions = {}
): ThunkAction {
  return (dispatch, getState) => {
    // Return cached mangaInfo if already loaded
    if (!ignoreCache && !selectShouldReloadLibrary(getState())) {
      return Promise.resolve().then(dispatch({ type: FETCH_MANGA_CACHE }));
    }

    dispatch({ type: FETCH_MANGA_REQUEST, meta: { mangaId } });

    return fetch(Server.mangaInfo(mangaId))
      .then(handleHTMLError)
      .then(
        json =>
          dispatch({ type: FETCH_MANGA_SUCCESS, mangaInfo: json.content }),
        error =>
          dispatch({
            type: FETCH_MANGA_FAILURE,
            errorMessage: "Failed to get this manga's information",
            meta: { error }
          })
      );
  };
}

export function updateMangaInfo(mangaId: number): ThunkAction {
  return dispatch => {
    dispatch({ type: UPDATE_MANGA_REQUEST, meta: { mangaId } });

    return fetch(Server.updateMangaInfo(mangaId))
      .then(handleHTMLError)
      .then(
        json => {
          dispatch({ type: UPDATE_MANGA_SUCCESS, meta: { json } });
          return dispatch(fetchMangaInfo(mangaId, { ignoreCache: true }));
        },
        error =>
          dispatch({
            type: UPDATE_MANGA_FAILURE,
            errorMessage: "Failed to update this manga's information",
            meta: { error }
          })
      );
  };
}

export function toggleFavorite(
  mangaId: number,
  isCurrentlyFavorite: boolean
): ThunkAction {
  return dispatch => {
    dispatch({
      type: TOGGLE_FAVORITE_REQUEST,
      meta: { mangaId, isCurrentlyFavorite }
    });

    return fetch(Server.toggleFavorite(mangaId, isCurrentlyFavorite))
      .then(handleHTMLError)
      .then(
        () => {
          const newFavoriteState = !isCurrentlyFavorite;

          dispatch({
            type: TOGGLE_FAVORITE_SUCCESS,
            mangaId,
            newFavoriteState: !isCurrentlyFavorite
          });

          if (newFavoriteState) {
            return dispatch({ type: ADD_TO_FAVORITES, mangaId });
          }
          return dispatch({ type: REMOVE_FROM_FAVORITES, mangaId });
        },
        () =>
          dispatch({
            type: TOGGLE_FAVORITE_FAILURE,
            errorMessage: isCurrentlyFavorite
              ? "Failed to unfavorite this manga"
              : "Failed to favorite this manga"
          })
      );
  };
}

export function setFlag(
  mangaId: number,
  flag: string,
  state: string
): ThunkAction {
  // I'm just updating the store without waiting for the server to reply
  // And failure should just pop up a message
  return (dispatch, getState) => {
    if (selectMangaFlagValue(getState(), mangaId, flag) === state) {
      return dispatch({
        type: SET_FLAG_NO_CHANGE,
        meta: { mangaId, flag, state }
      });
    }

    dispatch({
      type: SET_FLAG_REQUEST,
      mangaId,
      flag,
      state
    });

    // TODO: It's possible that the server might respond with
    //       { "success": false }, but I'm not checking that right now.
    return fetch(Server.setMangaFlag(mangaId, flag, state))
      .then(handleHTMLError)
      .then(
        () => dispatch({ type: SET_FLAG_SUCCESS }),
        () => dispatch({ type: SET_FLAG_FAILURE })
      );
  };
}
