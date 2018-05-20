import { Server } from 'api';
import { ADD_MANGA } from './mangaInfo';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'library/LOAD_REQUEST';
const SUCCESS = 'library/LOAD_SUCCESS';
const FAILURE = 'library/LOAD_FAILURE';
const CACHE = 'library/LOAD_CACHE';
export const LIBRARY_LOAD_ACTION = 'library/LOAD';

const GET_UNREAD_REQUEST = 'library/GET_UNREAD_REQUEST';
const GET_UNREAD_SUCCESS = 'library/GET_UNREAD_SUCCESS';
const GET_UNREAD_FAILURE = 'library/GET_UNREAD_FAILURE';
const GET_UNREAD_CACHE = 'library/GET_UNREAD_CACHE';

export const ADD_TO_FAVORITES = 'library/ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'library/REMOVE_FROM_FAVORITES';

// ================================================================================
// Reducers
// ================================================================================

// TODO: remove 'error' flag when error is fixed? Is there a more efficient way to do this?
export default function libraryReducer(
  state = {
    mangaIds: [], // array of mangaIds that point that data loaded in mangaInfo reducer
    libraryLoaded: false, // Library should be loaded once on first visit
    unread: {}, // { mangaId: int }
    reloadUnread: true, // should refresh unread for library if something new is added
  },
  action = {},
) {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        mangaIds: action.mangaIds,
        libraryLoaded: true,
      };

    case CACHE:
      return state;

    case GET_UNREAD_SUCCESS:
      return {
        ...state,
        unread: action.unread,
        reloadUnread: false,
      };

    case GET_UNREAD_CACHE:
      return state;

    case ADD_TO_FAVORITES:
      return {
        ...state,
        mangaIds: [...state.mangaIds, action.mangaId],
        reloadUnread: true,
      };

    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        mangaIds: state.mangaIds.filter(mangaId => mangaId !== action.mangaId),
      };

    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchLibrary({ ignoreCache = false } = {}) {
  return (dispatch, getState) => {
    // Return cached mangaLibrary if it's been loaded before
    if (!ignoreCache && getState().library.libraryLoaded) {
      return dispatch({ type: CACHE });
    }

    dispatch({ type: REQUEST });

    return fetch(Server.library())
      .then(
        res => res.json(),
        error =>
          dispatch({ type: FAILURE, errorMessage: 'Failed to load your library', meta: { error } }),
      )
      .then((json) => {
        const { content } = json;
        const mangaIds = transformToMangaIdsArray(content);

        dispatch({ type: ADD_MANGA, newManga: content });
        dispatch({ type: SUCCESS, mangaIds });
      });
  };
}

export function fetchUnread() {
  return (dispatch, getState) => {
    if (!getState().library.reloadUnread) {
      return dispatch({ type: GET_UNREAD_CACHE });
    }

    dispatch({ type: GET_UNREAD_REQUEST });

    return fetch(Server.libraryUnread())
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: GET_UNREAD_FAILURE,
            errorMessage: 'Failed to get unread chapters for your library',
            meta: { error },
          }),
      )
      .then(json => dispatch({ type: GET_UNREAD_SUCCESS, unread: transformUnread(json.content) }));
  };
}

// ================================================================================
// Helper functions
// ================================================================================
function transformUnread(unreadArray) {
  // [ { id: number, unread: number } ] -> { mangaId: unread }
  const newUnread = {};
  unreadArray.forEach((unreadObj) => {
    newUnread[unreadObj.id] = unreadObj.unread;
  });
  return newUnread;
}

function transformToMangaIdsArray(mangaArray) {
  return mangaArray.map(manga => manga.id);
}
