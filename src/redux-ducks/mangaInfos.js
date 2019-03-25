// @flow

import { Server } from "api";
import type { Manga } from "@tachiweb/api-client";
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from "redux-ducks/library";

// NOTE: for clarity, this will be called mangaInfos (with an s)
//       Info doesn't really have a plural, so I need to differentiate somehow
//
//       So mangaInfo refers to a single mangaInfo object
//       And mangaInfos refers to this state, which is the whole collection of mangaInfo-s

// ================================================================================
// Actions
// ================================================================================
const FETCH_MANGA_REQUEST = "mangaInfos/FETCH_REQUEST";
const FETCH_MANGA_SUCCESS = "mangaInfos/FETCH_SUCCESS";
const FETCH_MANGA_FAILURE = "mangaInfos/FETCH_FAILURE";
const FETCH_MANGA_CACHE = "mangaInfos/FETCH_CACHE";
export const FETCH_MANGA = "mangaInfos/FETCH";

const UPDATE_MANGA_REQUEST = "mangaInfos/UPDATE_REQUEST";
const UPDATE_MANGA_SUCCESS = "mangaInfos/UPDATE_SUCCESS";
const UPDATE_MANGA_FAILURE = "mangaInfos/UPDATE_FAILURE";
export const UPDATE_MANGA = "mangaInfos/UPDATE";

const TOGGLE_FAVORITE_REQUEST = "mangaInfos/TOGGLE_FAVORITE_REQUEST";
const TOGGLE_FAVORITE_SUCCESS = "mangaInfos/TOGGLE_FAVORITE_SUCCESS";
const TOGGLE_FAVORITE_FAILURE = "mangaInfos/TOGGLE_FAVORITE_FAILURE";
export const TOGGLE_FAVORITE = "mangaInfos/TOGGLE_FAVORITE";

export const ADD_MANGA = "mangaInfos/ADD_MANGA";

const SET_FLAG_REQUEST = "mangaInfos/SET_FLAG_REQUEST";
const SET_FLAG_SUCCESS = "mangaInfos/SET_FLAG_SUCCESS";
const SET_FLAG_FAILURE = "mangaInfos/SET_FLAG_FAILURE";
const SET_FLAG_NO_CHANGE = "mangaInfos/SET_FLAG_NO_CHANGE";

// ================================================================================
// Reducers
// ================================================================================
type State = { +[mangaId: number]: Manga };

export default function mangaInfosReducer(
  state: State = {},
  action: Object = {}
) {
  switch (action.type) {
    case ADD_MANGA:
      return { ...state, ...mangaArrayToObject(action.newManga) };

    case FETCH_MANGA_CACHE:
      return state;

    case UPDATE_MANGA_SUCCESS:
    case FETCH_MANGA_SUCCESS:
      return { ...state, [action.mangaInfo.id]: action.mangaInfo };

    case TOGGLE_FAVORITE_SUCCESS:
      return {
        ...state,
        [action.mangaId]: {
          ...state[action.mangaId],
          favorite: action.newFavoriteState
        }
      };

    case SET_FLAG_REQUEST:
      return {
        ...state,
        [action.mangaId]: {
          ...state[action.mangaId],
          flags: {
            ...state[action.mangaId].flags,
            [action.flag]: action.state
          }
        }
      };

    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
type Obj = { ignoreCache?: boolean };
export function fetchMangaInfo(
  mangaId: number,
  { ignoreCache = false }: Obj = {}
) {
  return (dispatch: Function, getState: Function) => {
    // Return cached mangaInfo if already loaded
    if (!ignoreCache && !getState().library.reloadLibrary) {
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

export function updateMangaInfo(mangaId: number) {
  return (dispatch: Function) => {
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

export function toggleFavorite(mangaId: number, isCurrentlyFavorite: boolean) {
  return (dispatch: Function) => {
    dispatch({
      type: TOGGLE_FAVORITE_REQUEST,
      meta: { mangaId, isCurrentlyFavorite }
    });

    // TODO Remove toString when https://github.com/OpenAPITools/openapi-generator/pull/2499 is merged
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

export function setFlag(mangaId: number, flag: string, state: string) {
  // I'm just updating the store without waiting for the server to reply
  // And failure should just pop up a message
  return (dispatch: Function, getState: Function) => {
    // Copy old flags state to ensure
    const oldFlags = getState().mangaInfos[mangaId].flags;
    if (oldFlags[flag] === state) {
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
      .setMangaFlags(mangaId, { ...oldFlags, [flag]: state })
      .then(
        () => dispatch({ type: SET_FLAG_SUCCESS }),
        () => dispatch({ type: SET_FLAG_FAILURE })
      );
  };
}

// ================================================================================
// Helper Functions
// ================================================================================
function mangaArrayToObject(mangaArray: Array<Manga>): State {
  const mangaObject = {};
  mangaArray.forEach(manga => {
    mangaObject[manga.id] = manga;
  });
  return mangaObject;
}
