import { Server } from 'api';
import { ADD_TO_FAVORITES, REMOVE_FROM_FAVORITES } from './library';

// ================================================================================
// Actions
// ================================================================================
const UPDATE_MANGA_REQUEST = 'mangaInfo/UPDATE_MANGA_REQUEST';
const UPDATE_MANGA_SUCCESS = 'mangaInfo/UPDATE_MANGA_SUCCESS';
const UPDATE_MANGA_FAILURE = 'mangaInfo/UPDATE_MANGA_FAILURE';

const TOGGLE_FAVORITE_REQUEST = 'mangaInfo/TOGGLE_FAVORITE_REQUEST';
const TOGGLE_FAVORITE_SUCCESS = 'mangaInfo/TOGGLE_FAVORITE_SUCCESS';
const TOGGLE_FAVORITE_FAILURE = 'mangaInfo/TOGGLE_FAVORITE_FAILURE';
export const TOGGLE_FAVORITE_ACTION = 'mangaInfo/TOGGLE_FAVORITE';

export const ADD_MANGA = 'mangaInfo/ADD_MANGA';

// ================================================================================
// Reducers
// ================================================================================
export default function mangaInfoReducer(state = {}, action = {}) {
  switch (action.type) {
    case ADD_MANGA:
      return { ...state, ...mangaArrayToObject(action.newManga) };

    case UPDATE_MANGA_SUCCESS:
      return { ...state, [action.mangaInfo.id]: action.mangaInfo };

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
export function updateMangaInfo(mangaId) {
  return (dispatch) => {
    dispatch({ type: UPDATE_MANGA_REQUEST, meta: { mangaId } });

    return fetch(Server.mangaInfo(mangaId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: UPDATE_MANGA_FAILURE,
            errorMessage: "Failed to update this manga's information",
            meta: { error },
          }),
      )
      .then(json => dispatch({ type: UPDATE_MANGA_SUCCESS, mangaInfo: json.content }));
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
