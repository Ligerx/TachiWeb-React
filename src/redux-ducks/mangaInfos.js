// @flow

import { Server } from "api";
import type { MangaType } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import createCachedSelector from "re-reselect";
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from "redux-ducks/library";
import { handleHTMLError } from "redux-ducks/utils";
import type { GlobalState } from "redux-ducks/reducers";

// NOTE: for clarity, this will be called mangaInfos (with an s)
//       Info doesn't really have a plural, so I need to differentiate somehow
//
//       So mangaInfo refers to a single mangaInfo object
//       And mangaInfos refers to this state, which is the whole collection of mangaInfo-s

// ================================================================================
// Actions
// ================================================================================
const FETCH_MANGA = "mangaInfos/FETCH";
const FETCH_MANGA_REQUEST = "mangaInfos/FETCH_REQUEST";
type FETCH_MANGA_REQUEST_TYPE = "mangaInfos/FETCH_REQUEST";
const FETCH_MANGA_SUCCESS = "mangaInfos/FETCH_SUCCESS";
type FETCH_MANGA_SUCCESS_TYPE = "mangaInfos/FETCH_SUCCESS";
const FETCH_MANGA_FAILURE = "mangaInfos/FETCH_FAILURE";
type FETCH_MANGA_FAILURE_TYPE = "mangaInfos/FETCH_FAILURE";
const FETCH_MANGA_CACHE = "mangaInfos/FETCH_CACHE";
type FETCH_MANGA_CACHE_TYPE = "mangaInfos/FETCH_CACHE";

type FetchMangaRequestAction = { type: FETCH_MANGA_REQUEST_TYPE, meta: Object };
type FetchMangaSuccessAction = {
  type: FETCH_MANGA_SUCCESS_TYPE,
  mangaInfo: MangaType
};
type FetchMangaFailureAction = {
  type: FETCH_MANGA_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type FetchMangaCacheAction = { type: FETCH_MANGA_CACHE_TYPE };

const UPDATE_MANGA = "mangaInfos/UPDATE";
const UPDATE_MANGA_REQUEST = "mangaInfos/UPDATE_REQUEST";
type UPDATE_MANGA_REQUEST_TYPE = "mangaInfos/UPDATE_REQUEST";
const UPDATE_MANGA_SUCCESS = "mangaInfos/UPDATE_SUCCESS";
type UPDATE_MANGA_SUCCESS_TYPE = "mangaInfos/UPDATE_SUCCESS";
const UPDATE_MANGA_FAILURE = "mangaInfos/UPDATE_FAILURE";
type UPDATE_MANGA_FAILURE_TYPE = "mangaInfos/UPDATE_FAILURE";

type UpdateMangaRequestAction = {
  type: UPDATE_MANGA_REQUEST_TYPE,
  meta: Object
};
// This indicates the manga has been rescraped. You should fetch it again after this.
type UpdateMangaSuccessAction = {
  type: UPDATE_MANGA_SUCCESS_TYPE,
  meta: Object
};
type UpdateMangaFailureAction = {
  type: UPDATE_MANGA_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

const TOGGLE_FAVORITE = "mangaInfos/TOGGLE_FAVORITE";
const TOGGLE_FAVORITE_REQUEST = "mangaInfos/TOGGLE_FAVORITE_REQUEST";
type TOGGLE_FAVORITE_REQUEST_TYPE = "mangaInfos/TOGGLE_FAVORITE_REQUEST";
const TOGGLE_FAVORITE_SUCCESS = "mangaInfos/TOGGLE_FAVORITE_SUCCESS";
type TOGGLE_FAVORITE_SUCCESS_TYPE = "mangaInfos/TOGGLE_FAVORITE_SUCCESS";
const TOGGLE_FAVORITE_FAILURE = "mangaInfos/TOGGLE_FAVORITE_FAILURE";
type TOGGLE_FAVORITE_FAILURE_TYPE = "mangaInfos/TOGGLE_FAVORITE_FAILURE";

type ToggleFavoriteRequestAction = {
  type: TOGGLE_FAVORITE_REQUEST_TYPE,
  meta: Object
};
type ToggleFavoriteSuccessAction = {
  type: TOGGLE_FAVORITE_SUCCESS_TYPE,
  mangaId: number,
  newFavoriteState: boolean
};
type ToggleFavoriteFailureAction = {
  type: TOGGLE_FAVORITE_FAILURE_TYPE,
  errorMessage: string
};

export const ADD_MANGA = "mangaInfos/ADD_MANGA";
type ADD_MANGA_TYPE = "mangaInfos/ADD_MANGA";

type AddMangaAction = { type: ADD_MANGA_TYPE, newManga: Array<MangaType> };

const SET_FLAG_REQUEST = "mangaInfos/SET_FLAG_REQUEST";
type SET_FLAG_REQUEST_TYPE = "mangaInfos/SET_FLAG_REQUEST";
const SET_FLAG_SUCCESS = "mangaInfos/SET_FLAG_SUCCESS";
type SET_FLAG_SUCCESS_TYPE = "mangaInfos/SET_FLAG_SUCCESS";
const SET_FLAG_FAILURE = "mangaInfos/SET_FLAG_FAILURE";
type SET_FLAG_FAILURE_TYPE = "mangaInfos/SET_FLAG_FAILURE";
const SET_FLAG_NO_CHANGE = "mangaInfos/SET_FLAG_NO_CHANGE";
type SET_FLAG_NO_CHANGE_TYPE = "mangaInfos/SET_FLAG_NO_CHANGE";

type SetFlagRequestAction = {
  type: SET_FLAG_REQUEST_TYPE,
  mangaId: number,
  // flag and state correspond with the key value pair of MangaInfoFlagsType
  // No obvious way to automatically type this in Flow
  flag: string,
  state: string
};
type SetFlagSuccessAction = { type: SET_FLAG_SUCCESS_TYPE };
type SetFlagFailureAction = { type: SET_FLAG_FAILURE_TYPE };
type SetFlagNoChangeAction = { type: SET_FLAG_NO_CHANGE_TYPE, meta: Object };

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnly<{ [mangaId: number]: MangaType }>;
type Action =
  | FetchMangaRequestAction
  | FetchMangaSuccessAction
  | FetchMangaFailureAction
  | FetchMangaCacheAction
  | UpdateMangaRequestAction
  | UpdateMangaSuccessAction
  | UpdateMangaFailureAction
  | ToggleFavoriteRequestAction
  | ToggleFavoriteSuccessAction
  | ToggleFavoriteFailureAction
  | AddMangaAction
  | SetFlagRequestAction
  | SetFlagSuccessAction
  | SetFlagFailureAction
  | SetFlagNoChangeAction;

export default function mangaInfosReducer(
  state: State = {},
  action: Action
): State {
  switch (action.type) {
    case ADD_MANGA:
      return { ...state, ...mangaArrayToObject(action.newManga) };

    case FETCH_MANGA_CACHE:
      return state;

    case FETCH_MANGA_SUCCESS:
      return { ...state, [action.mangaInfo.id]: action.mangaInfo };

    case UPDATE_MANGA_SUCCESS:
      return state;

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
// Selectors
// ================================================================================

export const selectIsMangaInfosLoading = createLoadingSelector([
  FETCH_MANGA,
  UPDATE_MANGA
]);

export const selectIsFavoriteToggling = createLoadingSelector([
  TOGGLE_FAVORITE
]);

export const selectMangaInfos = (state: GlobalState): State => state.mangaInfos;

export const selectMangaInfo = (
  state: GlobalState,
  mangaId: number
): ?MangaType => state.mangaInfos[mangaId];

// selectIsFavorite(state, mangaId: number)
// returns boolean
export const selectIsFavorite = createCachedSelector(
  [selectMangaInfos, (_, mangaId: number) => mangaId],
  (mangaInfos, mangaId): boolean => {
    if (!mangaInfos[mangaId]) return false;

    return mangaInfos[mangaId].favorite;
  }
  // Cache Key
)((state, mangaId) => mangaId);

// ================================================================================
// Action Creators
// ================================================================================
type GetState = () => GlobalState;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

type FetchOptions = { ignoreCache?: boolean };
export function fetchMangaInfo(
  mangaId: number,
  { ignoreCache = false }: FetchOptions = {}
): ThunkAction {
  return (dispatch, getState) => {
    // Return cached mangaInfo if already loaded
    if (!ignoreCache && !getState().library.reloadLibrary) {
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
    if (getState().mangaInfos[mangaId].flags[flag] === state) {
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

// ================================================================================
// Helper Functions
// ================================================================================
function mangaArrayToObject(mangaArray: Array<MangaType>): State {
  const mangaObject = {};
  mangaArray.forEach(manga => {
    mangaObject[manga.id] = manga;
  });
  return mangaObject;
}
