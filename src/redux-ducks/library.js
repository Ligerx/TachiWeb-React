// @flow
import { Server } from "api";
import type { GlobalState } from "redux-ducks/reducers";
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
import { updateChapters } from "redux-ducks/chapters";

// ================================================================================
// Actions
// ================================================================================
const FETCH_LIBRARY = "library/FETCH";
const FETCH_LIBRARY_REQUEST = "library/FETCH_REQUEST";
type FETCH_LIBRARY_REQUEST_TYPE = "library/FETCH_REQUEST";
const FETCH_LIBRARY_SUCCESS = "library/FETCH_SUCCESS";
type FETCH_LIBRARY_SUCCESS_TYPE = "library/FETCH_SUCCESS";
const FETCH_LIBRARY_FAILURE = "library/FETCH_FAILURE";
type FETCH_LIBRARY_FAILURE_TYPE = "library/FETCH_FAILURE";
const FETCH_LIBRARY_CACHE = "library/FETCH_CACHE";
type FETCH_LIBRARY_CACHE_TYPE = "library/FETCH_CACHE";

type FetchLibraryRequestAction = { type: FETCH_LIBRARY_REQUEST_TYPE };
type FetchLibrarySuccessAction = {
  type: FETCH_LIBRARY_SUCCESS_TYPE,
  mangaIds: Array<number>
};
type FetchLibraryFailureAction = {
  type: FETCH_LIBRARY_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type FetchLibraryCacheAction = { type: FETCH_LIBRARY_CACHE_TYPE };

const FETCH_UNREAD = "library/FETCH_UNREAD";
const FETCH_UNREAD_REQUEST = "library/FETCH_UNREAD_REQUEST";
type FETCH_UNREAD_REQUEST_TYPE = "library/FETCH_UNREAD_REQUEST";
const FETCH_UNREAD_SUCCESS = "library/FETCH_UNREAD_SUCCESS";
type FETCH_UNREAD_SUCCESS_TYPE = "library/FETCH_UNREAD_SUCCESS";
const FETCH_UNREAD_FAILURE = "library/FETCH_UNREAD_FAILURE";
type FETCH_UNREAD_FAILURE_TYPE = "library/FETCH_UNREAD_FAILURE";
const FETCH_UNREAD_CACHE = "library/FETCH_UNREAD_CACHE";
type FETCH_UNREAD_CACHE_TYPE = "library/FETCH_UNREAD_CACHE";

type FetchUnreadRequestAction = { type: FETCH_UNREAD_REQUEST_TYPE };
type FetchUnreadSuccessAction = {
  type: FETCH_UNREAD_SUCCESS_TYPE,
  unread: { [mangaId: number]: number }
};
type FetchUnreadFailureAction = {
  type: FETCH_UNREAD_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type FetchUnreadCacheAction = { type: FETCH_UNREAD_CACHE_TYPE };

const FETCH_LIBRARY_FLAGS = "library/FETCH_FLAGS";
const FETCH_LIBRARY_FLAGS_REQUEST = "library/FETCH_FLAGS_REQUEST";
type FETCH_LIBRARY_FLAGS_REQUEST_TYPE = "library/FETCH_FLAGS_REQUEST";
const FETCH_LIBRARY_FLAGS_SUCCESS = "library/FETCH_FLAGS_SUCCESS";
type FETCH_LIBRARY_FLAGS_SUCCESS_TYPE = "library/FETCH_FLAGS_SUCCESS";
const FETCH_LIBRARY_FLAGS_FAILURE = "library/FETCH_FLAGS_FAILURE";
type FETCH_LIBRARY_FLAGS_FAILURE_TYPE = "library/FETCH_FLAGS_FAILURE";
const FETCH_LIBRARY_FLAGS_CACHE = "library/FETCH_FLAGS_CACHE";
type FETCH_LIBRARY_FLAGS_CACHE_TYPE = "library/FETCH_FLAGS_CACHE";

type FetchLibraryFlagsRequestAction = {
  type: FETCH_LIBRARY_FLAGS_REQUEST_TYPE
};
type FetchLibraryFlagsSuccessAction = {
  type: FETCH_LIBRARY_FLAGS_SUCCESS_TYPE,
  flags: LibraryFlagsType
};
type FetchLibraryFlagsFailureAction = {
  type: FETCH_LIBRARY_FLAGS_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type FetchLibraryFlagsCacheAction = { type: FETCH_LIBRARY_FLAGS_CACHE_TYPE };

const SET_FLAG_REQUEST = "library/SET_FLAG_REQUEST";
type SET_FLAG_REQUEST_TYPE = "library/SET_FLAG_REQUEST";
const SET_FLAG_SUCCESS = "library/SET_FLAG_SUCCESS";
type SET_FLAG_SUCCESS_TYPE = "library/SET_FLAG_SUCCESS";
const SET_FLAG_FAILURE = "library/SET_FLAG_FAILURE";
type SET_FLAG_FAILURE_TYPE = "library/SET_FLAG_FAILURE";

type SetFlagRequestAction = {
  type: SET_FLAG_REQUEST_TYPE,
  // key value pair for LibraryFlagsType
  flag: string,
  value: LibraryFlagsPossibleValueTypes
};
type SetFlagSuccessAction = { type: SET_FLAG_SUCCESS_TYPE };
type SetFlagFailureAction = { type: SET_FLAG_FAILURE_TYPE };

const UPLOAD_RESTORE = "library/UPLOAD_RESTORE";
const UPLOAD_RESTORE_REQUEST = "library/UPLOAD_RESTORE_REQUEST";
type UPLOAD_RESTORE_REQUEST_TYPE = "library/UPLOAD_RESTORE_REQUEST";
const UPLOAD_RESTORE_SUCCESS = "library/UPLOAD_RESTORE_SUCCESS";
type UPLOAD_RESTORE_SUCCESS_TYPE = "library/UPLOAD_RESTORE_SUCCESS";
const UPLOAD_RESTORE_FAILURE = "library/UPLOAD_RESTORE_FAILURE";
type UPLOAD_RESTORE_FAILURE_TYPE = "library/UPLOAD_RESTORE_FAILURE";

type UploadRestoreRequestAction = { type: UPLOAD_RESTORE_REQUEST_TYPE };
type UploadRestoreSuccessAction = { type: UPLOAD_RESTORE_SUCCESS_TYPE };
type UploadRestoreFailureAction = {
  type: UPLOAD_RESTORE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

export const ADD_TO_FAVORITES = "library/ADD_TO_FAVORITES";
type ADD_TO_FAVORITES_TYPE = "library/ADD_TO_FAVORITES";
export const REMOVE_FROM_FAVORITES = "library/REMOVE_FROM_FAVORITES";
type REMOVE_FROM_FAVORITES_TYPE = "library/REMOVE_FROM_FAVORITES";
export const ADJUST_UNREAD = "library/ADJUST_UNREAD";
type ADJUST_UNREAD_TYPE = "library/ADJUST_UNREAD";

type AddToFavoriteAction = { type: ADD_TO_FAVORITES_TYPE, mangaId: number };
type RemoveFromFavoriteAction = {
  type: REMOVE_FROM_FAVORITES_TYPE,
  mangaId: number
};
type AdjustUnreadAction = {
  type: ADJUST_UNREAD_TYPE,
  mangaId: number,
  difference: 1 | -1
};

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnly<{
  mangaIds: $ReadOnlyArray<number>,
  reloadLibrary: boolean,
  unread: $ReadOnly<{ [mangaId: number]: number }>,
  reloadUnread: boolean,
  flags: LibraryFlagsType,
  isFlagsLoaded: boolean
}>;
type Action =
  | FetchLibraryRequestAction
  | FetchLibrarySuccessAction
  | FetchLibraryFailureAction
  | FetchLibraryCacheAction
  | FetchUnreadRequestAction
  | FetchUnreadSuccessAction
  | FetchUnreadFailureAction
  | FetchUnreadCacheAction
  | FetchLibraryFlagsRequestAction
  | FetchLibraryFlagsSuccessAction
  | FetchLibraryFlagsFailureAction
  | FetchLibraryFlagsCacheAction
  | SetFlagRequestAction
  | SetFlagSuccessAction
  | SetFlagFailureAction
  | UploadRestoreRequestAction
  | UploadRestoreSuccessAction
  | UploadRestoreFailureAction
  | AddToFavoriteAction
  | RemoveFromFavoriteAction
  | AdjustUnreadAction;

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
  action: Action
): State {
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

export const selectIsRestoreLoading = createLoadingSelector([UPLOAD_RESTORE]);
export const selectDidRestoreFail = createErrorSelector([UPLOAD_RESTORE]);

export const selectIsLibraryLoading = createLoadingSelector([
  FETCH_LIBRARY,
  FETCH_UNREAD,
  FETCH_LIBRARY_FLAGS
]);

export const selectLibraryMangaIds = (
  state: GlobalState
): $ReadOnlyArray<number> => state.library.mangaIds;

export const selectUnread = (
  state: GlobalState
): $ReadOnly<{ [mangaId: number]: number }> => state.library.unread;

export const selectLibraryFlags = (state: GlobalState): LibraryFlagsType =>
  state.library.flags;

export const selectLibraryMangaInfos = createSelector(
  [selectMangaInfos, selectLibraryMangaIds],
  (mangaInfos, mangaIds): Array<MangaType> => {
    return mangaIds.map(mangaId => mangaInfos[mangaId]);
  }
);

// selectFilteredSortedLibrary(state, searchQuery: string)
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

type Options = { ignoreCache?: boolean };
export function fetchLibrary({
  ignoreCache = false
}: Options = {}): ThunkAction {
  return (dispatch, getState) => {
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

export function fetchUnread({
  ignoreCache = false
}: Options = {}): ThunkAction {
  return (dispatch, getState) => {
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

export function updateLibrary(): ThunkAction {
  return (dispatch, getState) => {
    // https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
    function serialPromiseChain(promiseArray) {
      return promiseArray.reduce(
        (promiseChain, currentPromise) =>
          promiseChain.then(() => currentPromise()),
        Promise.resolve([])
      );
    }

    const library = selectLibraryMangaInfos(getState());

    // Create an array of promise functions
    // Since calling updateChapters runs the function, create an intermediate function
    const updateChapterPromises = library.map(mangaInfo => () =>
      dispatch(updateChapters(mangaInfo.id))
    );

    return serialPromiseChain(updateChapterPromises).then(() => {
      dispatch(fetchLibrary({ ignoreCache: true }));
      dispatch(fetchUnread({ ignoreCache: true }));
    });
  };
}

export function uploadRestoreFile(file: File): ThunkAction {
  return dispatch => {
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

export function fetchLibraryFlags(): ThunkAction {
  return (dispatch, getState) => {
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
): ThunkAction {
  // Updating the store without waiting for the server to reply
  return (dispatch, getState) => {
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
