// @flow
import { Server } from 'api';
import type { MangaType } from 'types';
import { ADD_MANGA } from './mangaInfos';

// ================================================================================
// Actions
// ================================================================================
const FETCH_LIBRARY_REQUEST = 'library/FETCH_REQUEST';
const FETCH_LIBRARY_SUCCESS = 'library/FETCH_SUCCESS';
const FETCH_LIBRARY_FAILURE = 'library/FETCH_FAILURE';
const FETCH_LIBRARY_CACHE = 'library/FETCH_CACHE';
export const FETCH_LIBRARY = 'library/FETCH';

const FETCH_UNREAD_REQUEST = 'library/FETCH_UNREAD_REQUEST';
const FETCH_UNREAD_SUCCESS = 'library/FETCH_UNREAD_SUCCESS';
const FETCH_UNREAD_FAILURE = 'library/FETCH_UNREAD_FAILURE';
const FETCH_UNREAD_CACHE = 'library/FETCH_UNREAD_CACHE';
export const FETCH_UNREAD = 'library/FETCH_UNREAD';

export const ADD_TO_FAVORITES = 'library/ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'library/REMOVE_FROM_FAVORITES';
export const DECREMENT_UNREAD = 'library/DECREMENT_UNREAD';

// ================================================================================
// Reducers
// ================================================================================
type State = {
  +mangaIds: $ReadOnlyArray<number>,
  +libraryLoaded: boolean,
  +unread: { +[mangaId: number]: number },
  +reloadUnread: boolean,
};

export default function libraryReducer(
  state: State = {
    mangaIds: [], // array of mangaIds that point that data loaded in mangaInfos reducer
    libraryLoaded: false, // Library should be loaded once on first visit
    unread: {}, // { mangaId: int }
    reloadUnread: true, // should refresh unread for library if something new is added
  },
  action = {},
) {
  switch (action.type) {
    case FETCH_LIBRARY_SUCCESS:
      return {
        ...state,
        mangaIds: action.mangaIds,
        libraryLoaded: true,
      };

    case FETCH_LIBRARY_CACHE:
      return state;

    case FETCH_UNREAD_SUCCESS:
      return {
        ...state,
        unread: action.unread,
        reloadUnread: false,
      };

    case FETCH_UNREAD_CACHE:
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

    case DECREMENT_UNREAD: {
      const { unread } = state;
      const { mangaId } = action;
      return {
        ...state,
        unread: {
          ...unread,
          [mangaId]: unread[mangaId] - 1,
        },
      };
    }
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
type Obj = { ignoreCache?: boolean };
export function fetchLibrary({ ignoreCache = false }: Obj = {}) {
  return (dispatch: Function, getState: Function) => {
    // Return cached mangaLibrary if it's been loaded before
    if (!ignoreCache && getState().library.libraryLoaded) {
      return dispatch({ type: FETCH_LIBRARY_CACHE });
    }

    dispatch({ type: FETCH_LIBRARY_REQUEST });

    return fetch(Server.library())
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FETCH_LIBRARY_FAILURE,
            errorMessage: 'Failed to load your library',
            meta: { error },
          }),
      )
      .then((json) => {
        const { content } = json;
        const mangaIds = transformToMangaIdsArray(content);

        dispatch({ type: ADD_MANGA, newManga: content });
        dispatch({ type: FETCH_LIBRARY_SUCCESS, mangaIds });
      });
  };
}

export function fetchUnread() {
  return (dispatch: Function, getState: Function) => {
    if (!getState().library.reloadUnread) {
      return dispatch({ type: FETCH_UNREAD_CACHE });
    }

    dispatch({ type: FETCH_UNREAD_REQUEST });

    return fetch(Server.libraryUnread())
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FETCH_UNREAD_FAILURE,
            errorMessage: 'Failed to get unread chapters for your library',
            meta: { error },
          }),
      )
      .then(json =>
        dispatch({ type: FETCH_UNREAD_SUCCESS, unread: transformUnread(json.content) }));
  };
}

// ================================================================================
// Helper functions
// ================================================================================
type Param = Array<{ id: number, unread: number }>;
type Return = { [mangaId: number]: number };

function transformUnread(unreadArray: Param): Return {
  const newUnread = {};
  unreadArray.forEach((unreadObj) => {
    newUnread[unreadObj.id] = unreadObj.unread;
  });
  return newUnread;
}

function transformToMangaIdsArray(mangaArray: Array<MangaType>): Array<number> {
  return mangaArray.map(manga => manga.id);
}
