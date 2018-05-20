import { Server } from 'api';
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from './library';

// NOTE: for clarity, this will be called mangaInfos (with an s)
//       Info doesn't really have a plural, so I need to differentiate somehow
//
//       So mangaInfo refers to a single mangaInfo object
//       And mangaInfos refers to this state, which is the whole collection of mangaInfo-s

// ================================================================================
// Actions
// ================================================================================
const FETCH_MANGA_REQUEST = 'mangaInfos/FETCH_REQUEST';
const FETCH_MANGA_SUCCESS = 'mangaInfos/FETCH_SUCCESS';
const FETCH_MANGA_FAILURE = 'mangaInfos/FETCH_FAILURE';
const FETCH_MANGA_CACHE = 'mangaInfos/FETCH_CACHE';
export const FETCH_MANGA = 'mangaInfos/FETCH';

const UPDATE_MANGA_REQUEST = 'mangaInfos/UPDATE_REQUEST';
const UPDATE_MANGA_SUCCESS = 'mangaInfos/UPDATE_SUCCESS';
const UPDATE_MANGA_FAILURE = 'mangaInfos/UPDATE_FAILURE';
export const UPDATE_MANGA = 'mangaInfos/UPDATE';

const TOGGLE_FAVORITE_REQUEST = 'mangaInfos/TOGGLE_FAVORITE_REQUEST';
const TOGGLE_FAVORITE_SUCCESS = 'mangaInfos/TOGGLE_FAVORITE_SUCCESS';
const TOGGLE_FAVORITE_FAILURE = 'mangaInfos/TOGGLE_FAVORITE_FAILURE';
export const TOGGLE_FAVORITE = 'mangaInfos/TOGGLE_FAVORITE';

export const ADD_MANGA = 'mangaInfos/ADD_MANGA';

// ================================================================================
// Reducers
// ================================================================================
export default function mangaInfosReducer(state = {}, action = {}) {
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
          favorite: action.newFavoriteState,
        },
      };

    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchMangaInfo(mangaId, { ignoreCache = false } = {}) {
  return (dispatch, getState) => {
    // Return cached mangaInfo if already loaded
    if (!ignoreCache && getState().library.libraryLoaded) {
      return dispatch({ type: FETCH_MANGA_CACHE });
    }

    dispatch({ type: FETCH_MANGA_REQUEST, meta: { mangaId } });

    return fetch(Server.mangaInfo(mangaId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FETCH_MANGA_FAILURE,
            errorMessage: "Failed to get this manga's information",
            meta: { error },
          }),
      )
      .then(json => dispatch({ type: FETCH_MANGA_SUCCESS, mangaInfo: json.content }));
  };
}

export function updateMangaInfo(mangaId) {
  return (dispatch) => {
    dispatch({ type: UPDATE_MANGA_REQUEST, meta: { mangaId } });

    return fetch(Server.updateMangaInfo(mangaId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: UPDATE_MANGA_FAILURE,
            errorMessage: "Failed to update this manga's information",
            meta: { error },
          }),
      )
      .then((json) => {
        dispatch({ type: UPDATE_MANGA_SUCCESS, meta: { json } });
        return dispatch(fetchMangaInfo(mangaId, { ignoreCache: true }));
      });
  };
}

export function toggleFavorite(mangaId, isCurrentlyFavorite) {
  return (dispatch) => {
    dispatch({ type: TOGGLE_FAVORITE_REQUEST, meta: { mangaId, isCurrentlyFavorite } });

    return fetch(Server.toggleFavorite(mangaId, isCurrentlyFavorite)).then(
      () => {
        const newFavoriteState = !isCurrentlyFavorite;

        dispatch({
          type: TOGGLE_FAVORITE_SUCCESS,
          mangaId,
          newFavoriteState: !isCurrentlyFavorite,
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
            ? 'Failed to unfavorite this manga'
            : 'Failed to favorite this manga',
        }),
    );
  };
}

// ================================================================================
// Helper Functions
// ================================================================================
function mangaArrayToObject(mangaArray) {
  const mangaObject = {};
  mangaArray.forEach((manga) => {
    mangaObject[manga.id] = manga;
  });
  return mangaObject;
}