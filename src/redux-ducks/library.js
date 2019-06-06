// @flow
import { Server } from "api";
import type {
  MangaType,
  LibraryFlagsType,
  LibraryFlagsPossibleValueTypes
} from "types";
import { selectMangaInfos, ADD_MANGA } from "redux-ducks/mangaInfos";
import { handleHTMLError, transformToMangaIdsArray } from "redux-ducks/utils";
import { createLoadingSelector } from "redux-ducks/loading";
import { createErrorSelector } from "redux-ducks/error";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import filterSortLibrary from "redux-ducks/libraryUtils";

// ================================================================================
// Actions
// ================================================================================
const FETCH_LIBRARY_REQUEST = "library/FETCH_REQUEST";
const FETCH_LIBRARY_SUCCESS = "library/FETCH_SUCCESS";
const FETCH_LIBRARY_FAILURE = "library/FETCH_FAILURE";
const FETCH_LIBRARY_CACHE = "library/FETCH_CACHE";
export const FETCH_LIBRARY = "library/FETCH";

const FETCH_UNREAD_REQUEST = "library/FETCH_UNREAD_REQUEST";
const FETCH_UNREAD_SUCCESS = "library/FETCH_UNREAD_SUCCESS";
const FETCH_UNREAD_FAILURE = "library/FETCH_UNREAD_FAILURE";
const FETCH_UNREAD_CACHE = "library/FETCH_UNREAD_CACHE";
export const FETCH_UNREAD = "library/FETCH_UNREAD";

export const ADD_TO_FAVORITES = "library/ADD_TO_FAVORITES";
export const REMOVE_FROM_FAVORITES = "library/REMOVE_FROM_FAVORITES";
export const ADJUST_UNREAD = "library/ADJUST_UNREAD";

const UPLOAD_RESTORE_REQUEST = "library/UPLOAD_RESTORE_REQUEST";
const UPLOAD_RESTORE_SUCCESS = "library/UPLOAD_RESTORE_SUCCESS";
const UPLOAD_RESTORE_FAILURE = "library/UPLOAD_RESTORE_FAILURE";
export const UPLOAD_RESTORE = "library/UPLOAD_RESTORE";

const FETCH_LIBRARY_FLAGS_REQUEST = "library/FETCH_FLAGS_REQUEST";
const FETCH_LIBRARY_FLAGS_SUCCESS = "library/FETCH_FLAGS_SUCCESS";
const FETCH_LIBRARY_FLAGS_FAILURE = "library/FETCH_FLAGS_FAILURE";
const FETCH_LIBRARY_FLAGS_CACHE = "library/FETCH_FLAGS_CACHE";
export const FETCH_LIBRARY_FLAGS = "library/FETCH_FLAGS";

const SET_FLAG_REQUEST = "library/SET_FLAG_REQUEST";
const SET_FLAG_SUCCESS = "library/SET_FLAG_SUCCESS";
const SET_FLAG_FAILURE = "library/SET_FLAG_FAILURE";

// ================================================================================
// Reducers
// ================================================================================
type State = {
  +mangaIds: $ReadOnlyArray<number>,
  +reloadLibrary: boolean,
  +unread: { +[mangaId: number]: number },
  +reloadUnread: boolean,
  +flags: LibraryFlagsType,
  +isFlagsLoaded: boolean
};

const defaultState: State = {
  mangaIds: [], // array of mangaIds that point at data loaded in mangaInfos reducer
  reloadLibrary: true, // Library should be loaded once on first visit
  unread: {}, // { mangaId: int }
  reloadUnread: true, // should refresh unread for library if something new is added
  flags: {
    filters: [
      {
        type: "DOWNLOADED",
        status: "ANY"
      },
      {
        type: "UNREAD",
        status: "ANY"
      },
      {
        type: "COMPLETED",
        status: "ANY"
      }
    ],
    sort: {
      type: "ALPHA",
      direction: "ASCENDING"
    },
    display: "GRID",
    show_download_badges: false
  },
  isFlagsLoaded: false // fetch flags on first load
};

export default function libraryReducer(
  state: State = defaultState,
  action = {}
) {
  switch (action.type) {
    case FETCH_LIBRARY_SUCCESS:
      return {
        ...state,
        mangaIds: action.mangaIds,
        reloadLibrary: false
      };

    case FETCH_UNREAD_SUCCESS:
      return {
        ...state,
        unread: action.unread,
        reloadUnread: false
      };

    case ADD_TO_FAVORITES:
      return {
        ...state,
        mangaIds: [...state.mangaIds, action.mangaId],
        reloadUnread: true
      };

    case REMOVE_FROM_FAVORITES: {
      const newMangaIds: Array<number> = state.mangaIds.filter(
        mangaId => mangaId !== action.mangaId
      );
      return {
        ...state,
        mangaIds: newMangaIds
      };
    }

    case ADJUST_UNREAD: {
      const { unread } = state;
      const { mangaId, difference } = action; // difference should be 1 or -1
      return {
        ...state,
        unread: {
          ...unread,
          [mangaId]: unread[mangaId] + difference
        }
      };
    }

    case UPLOAD_RESTORE_SUCCESS:
      return {
        ...state,
        reloadLibrary: true,
        reloadUnread: true,
        isFlagsLoaded: false
      };

    case FETCH_LIBRARY_FLAGS_SUCCESS:
      return {
        ...state,
        flags: action.flags,
        isFlagsLoaded: true
      };

    case SET_FLAG_REQUEST:
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: action.value
        }
      };

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsLibraryLoading = createLoadingSelector([
  FETCH_LIBRARY,
  FETCH_UNREAD,
  FETCH_LIBRARY_FLAGS
]);

export const selectLibraryMangaIds = (state): $ReadOnlyArray<number> =>
  state.library.mangaIds;

export const selectUnread = (state): { +[mangaId: number]: number } =>
  state.library.unread;

export const selectLibraryFlags = (state): LibraryFlagsType =>
  state.library.flags;

export const selectLibraryMangaInfos = createSelector(
  [selectMangaInfos, selectLibraryMangaIds],
  (mangaInfos, mangaIds): Array<MangaType> => {
    return mangaIds.map(mangaId => mangaInfos[mangaId]);
  }
);

// selectFilteredSortedLibrary(state, searchQuery)
export const selectFilteredSortedLibrary = createCachedSelector(
  [
    selectLibraryMangaInfos,
    selectLibraryFlags,
    selectUnread,
    (_, searchQuery) => searchQuery
  ],
  filterSortLibrary
  // Cache Key
)((_, searchQuery) => searchQuery);

export const selectIsRestoreLoading = createLoadingSelector([UPLOAD_RESTORE]);
export const selectDidRestoreFail = createErrorSelector([UPLOAD_RESTORE]);

// ================================================================================
// Action Creators
// ================================================================================
type Options = { ignoreCache?: boolean };
export function fetchLibrary({ ignoreCache = false }: Options = {}) {
  return (dispatch: Function, getState: Function) => {
    // Return cached mangaLibrary if it's been loaded before
    if (!ignoreCache && !getState().library.reloadLibrary) {
      return dispatch({ type: FETCH_LIBRARY_CACHE });
    }

    dispatch({ type: FETCH_LIBRARY_REQUEST });

    return fetch(Server.library())
      .then(handleHTMLError)
      .then(
        json => {
          const { content } = json;
          const mangaIds = transformToMangaIdsArray(content);

          dispatch({ type: ADD_MANGA, newManga: content });
          dispatch({ type: FETCH_LIBRARY_SUCCESS, mangaIds });
        },
        error =>
          dispatch({
            type: FETCH_LIBRARY_FAILURE,
            errorMessage: "Failed to load your library",
            meta: { error }
          })
      );
  };
}

export function fetchUnread({ ignoreCache = false }: Options = {}) {
  return (dispatch: Function, getState: Function) => {
    if (!ignoreCache && !getState().library.reloadUnread) {
      return dispatch({ type: FETCH_UNREAD_CACHE });
    }

    dispatch({ type: FETCH_UNREAD_REQUEST });

    return fetch(Server.libraryUnread())
      .then(handleHTMLError)
      .then(
        json =>
          dispatch({
            type: FETCH_UNREAD_SUCCESS,
            unread: transformUnread(json.content)
          }),
        error =>
          dispatch({
            type: FETCH_UNREAD_FAILURE,
            errorMessage: "Failed to get unread chapters for your library",
            meta: { error }
          })
      );
  };
}

export function uploadRestoreFile(file: File) {
  return (dispatch: Function) => {
    dispatch({ type: UPLOAD_RESTORE_REQUEST });

    return fetch(Server.restoreUpload(), uploadPostParameters(file))
      .then(handleHTMLError)
      .then(
        // TODO: I'm not currently checking if the response message says failure or success
        () => dispatch({ type: UPLOAD_RESTORE_SUCCESS }),
        error =>
          dispatch({
            type: UPLOAD_RESTORE_FAILURE,
            errorMessage: `Failed to restore library from ${file.name}`,
            meta: { error }
          })
      );
  };
}

export function fetchLibraryFlags() {
  return (dispatch: Function, getState: Function) => {
    if (getState().library.isFlagsLoaded) {
      return dispatch({ type: FETCH_LIBRARY_FLAGS_CACHE });
    }

    dispatch({ type: FETCH_LIBRARY_FLAGS_REQUEST });

    return fetch(Server.libraryFlags())
      .then(handleHTMLError)
      .then(
        json =>
          dispatch({ type: FETCH_LIBRARY_FLAGS_SUCCESS, flags: json.data }),
        error =>
          dispatch({
            type: FETCH_LIBRARY_FLAGS_FAILURE,
            errorMessage: "Failed to load your library settings.",
            meta: { error }
          })
      );
  };
}

export function setLibraryFlag(
  flag: string,
  value: LibraryFlagsPossibleValueTypes
) {
  // Updating the store without waiting for the server to reply
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: SET_FLAG_REQUEST, flag, value });

    return fetch(Server.libraryFlags(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getState().library.flags)
    })
      .then(handleHTMLError)
      .then(
        () => dispatch({ type: SET_FLAG_SUCCESS }),
        () => dispatch({ type: SET_FLAG_FAILURE })
      );
  };
}

// ================================================================================
// Helper functions
// ================================================================================
type Param = Array<{ id: number, unread: number }>;
type Return = { [mangaId: number]: number };

function transformUnread(unreadArray: Param): Return {
  const newUnread = {};
  unreadArray.forEach(unreadObj => {
    newUnread[unreadObj.id] = unreadObj.unread;
  });
  return newUnread;
}

function uploadPostParameters(file: File): Object {
  const formData = new FormData();
  formData.append("uploaded_file", file);

  return { method: "POST", body: formData };
}
