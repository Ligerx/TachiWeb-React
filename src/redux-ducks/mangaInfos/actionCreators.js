// @flow
import { Server } from "api";
import type { MangaFlags } from "@tachiweb/api-client";
import type { ThunkAction } from "redux-ducks/reducers";
import { selectShouldReloadLibrary } from "redux-ducks/library";
import {
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES
} from "redux-ducks/library/actions";
import { selectMangaFlags } from ".";
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

    return Server.api()
      .getManga(mangaId)
      .then(
        manga => dispatch({ type: FETCH_MANGA_SUCCESS, mangaInfo: manga }),
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

    return Server.api()
      .updateMangaInfo(mangaId)
      .then(
        manga => dispatch({ type: UPDATE_MANGA_SUCCESS, mangaInfo: manga }),
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

    // TODO: Remove toString when https://github.com/OpenAPITools/openapi-generator/pull/2499 is merged
    return Server.api()
      .setMangaFavorited(mangaId, (!isCurrentlyFavorite).toString())
      .then(
        newFavoriteState => {
          dispatch({
            type: TOGGLE_FAVORITE_SUCCESS,
            mangaId,
            newFavoriteState
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

// TODO:
// [July 24, 2019] There's no batch method for setting a manga's favorite status. Currently just
// looping over toggleFavorite(), but should probably refactor these 2 methods at some point.
export function unfavoriteMultiple(mangaIds: Array<number>) {
  // not sure if I need to chain promises instead of doing them all at once
  mangaIds.forEach(mangaId => toggleFavorite(mangaId, true));
}

export function setFlag(
  mangaId: number,
  flag: $Keys<MangaFlags>,
  state: string
): ThunkAction {
  // I'm just updating the store without waiting for the server to reply
  // And failure should just pop up a message
  return (dispatch, getState) => {
    // [June 15, 2019] setMangaFlags() requires an updated copy of the full flag object.
    // SET_FLAG_REQUEST is optimistically updating, so we could just call
    // selectMangaFlags(getState(), mangaId) again to get the updated flags.
    //
    // However, that's potentially brittle, so save a copy of the prevFlags and
    // manually update it here just to be safe.
    const prevFlags = selectMangaFlags(getState(), mangaId);

    if (prevFlags[flag] === state) {
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

    // TODO: This request could fail, but I'm not checking that right now.
    return Server.api()
      .setMangaFlags(mangaId, { ...prevFlags, [flag]: state })
      .then(
        () => dispatch({ type: SET_FLAG_SUCCESS }),
        () => dispatch({ type: SET_FLAG_FAILURE })
      );
  };
}
