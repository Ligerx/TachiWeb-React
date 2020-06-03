// @flow
import type { LibraryFlagsType, LibraryFlagsPossibleValueTypes } from "types";

// ================================================================================
// Fetch Library
// ================================================================================

// Action Constants and Types
export const FETCH_LIBRARY = "library/FETCH";

export const FETCH_LIBRARY_REQUEST = "library/FETCH_REQUEST";
type FETCH_LIBRARY_REQUEST_TYPE = "library/FETCH_REQUEST";

export const FETCH_LIBRARY_SUCCESS = "library/FETCH_SUCCESS";
type FETCH_LIBRARY_SUCCESS_TYPE = "library/FETCH_SUCCESS";

export const FETCH_LIBRARY_FAILURE = "library/FETCH_FAILURE";
type FETCH_LIBRARY_FAILURE_TYPE = "library/FETCH_FAILURE";

export const FETCH_LIBRARY_CACHE = "library/FETCH_CACHE";
type FETCH_LIBRARY_CACHE_TYPE = "library/FETCH_CACHE";

// Action Object Types
type FetchLibraryRequestAction = { type: FETCH_LIBRARY_REQUEST_TYPE };

type FetchLibrarySuccessAction = {
  type: FETCH_LIBRARY_SUCCESS_TYPE,
  mangaIds: Array<number>,
  downloaded: $ReadOnly<{ [index: number]: number }>,
  totalChaptersSortIndexes: $ReadOnly<{ [index: number]: number }>,
  lastReadSortIndexes: $ReadOnly<{ [index: number]: number }>
};

type FetchLibraryFailureAction = {
  type: FETCH_LIBRARY_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchLibraryCacheAction = { type: FETCH_LIBRARY_CACHE_TYPE };

// ================================================================================
// Fetch library flags
// ================================================================================

// Action Constants and Types
export const FETCH_LIBRARY_FLAGS = "library/FETCH_FLAGS";

export const FETCH_LIBRARY_FLAGS_REQUEST = "library/FETCH_FLAGS_REQUEST";
type FETCH_LIBRARY_FLAGS_REQUEST_TYPE = "library/FETCH_FLAGS_REQUEST";

export const FETCH_LIBRARY_FLAGS_SUCCESS = "library/FETCH_FLAGS_SUCCESS";
type FETCH_LIBRARY_FLAGS_SUCCESS_TYPE = "library/FETCH_FLAGS_SUCCESS";

export const FETCH_LIBRARY_FLAGS_FAILURE = "library/FETCH_FLAGS_FAILURE";
type FETCH_LIBRARY_FLAGS_FAILURE_TYPE = "library/FETCH_FLAGS_FAILURE";

export const FETCH_LIBRARY_FLAGS_CACHE = "library/FETCH_FLAGS_CACHE";
type FETCH_LIBRARY_FLAGS_CACHE_TYPE = "library/FETCH_FLAGS_CACHE";

// Action Object Types
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

// ================================================================================
// Set library flags
// ================================================================================

// Action Constants and Types
export const SET_FLAG_REQUEST = "library/SET_FLAG_REQUEST";
type SET_FLAG_REQUEST_TYPE = "library/SET_FLAG_REQUEST";

export const SET_FLAG_SUCCESS = "library/SET_FLAG_SUCCESS";
type SET_FLAG_SUCCESS_TYPE = "library/SET_FLAG_SUCCESS";

export const SET_FLAG_FAILURE = "library/SET_FLAG_FAILURE";
type SET_FLAG_FAILURE_TYPE = "library/SET_FLAG_FAILURE";

// Action Object Types
type SetFlagRequestAction = {
  type: SET_FLAG_REQUEST_TYPE,
  // key value pair for LibraryFlagsType
  flag: string,
  value: LibraryFlagsPossibleValueTypes
};

type SetFlagSuccessAction = { type: SET_FLAG_SUCCESS_TYPE };

type SetFlagFailureAction = { type: SET_FLAG_FAILURE_TYPE };

// ================================================================================
// Upload backup file and restore
// ================================================================================

// Action Constants and Types
export const UPLOAD_RESTORE = "library/UPLOAD_RESTORE";

export const UPLOAD_RESTORE_REQUEST = "library/UPLOAD_RESTORE_REQUEST";
type UPLOAD_RESTORE_REQUEST_TYPE = "library/UPLOAD_RESTORE_REQUEST";

export const UPLOAD_RESTORE_SUCCESS = "library/UPLOAD_RESTORE_SUCCESS";
type UPLOAD_RESTORE_SUCCESS_TYPE = "library/UPLOAD_RESTORE_SUCCESS";

export const UPLOAD_RESTORE_FAILURE = "library/UPLOAD_RESTORE_FAILURE";
type UPLOAD_RESTORE_FAILURE_TYPE = "library/UPLOAD_RESTORE_FAILURE";

// Action Object Types
type UploadRestoreRequestAction = { type: UPLOAD_RESTORE_REQUEST_TYPE };

type UploadRestoreSuccessAction = { type: UPLOAD_RESTORE_SUCCESS_TYPE };

type UploadRestoreFailureAction = {
  type: UPLOAD_RESTORE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// etc library actions
// ================================================================================

// Action Constants and Types
export const ADD_TO_FAVORITES = "library/ADD_TO_FAVORITES";
type ADD_TO_FAVORITES_TYPE = "library/ADD_TO_FAVORITES";

export const REMOVE_FROM_FAVORITES = "library/REMOVE_FROM_FAVORITES";
type REMOVE_FROM_FAVORITES_TYPE = "library/REMOVE_FROM_FAVORITES";

// Action Object Types
export type AddToFavoriteAction = {
  type: ADD_TO_FAVORITES_TYPE,
  mangaId: number
};

export type RemoveFromFavoriteAction = {
  type: REMOVE_FROM_FAVORITES_TYPE,
  mangaId: number
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type LibraryAction =
  | FetchLibraryRequestAction
  | FetchLibrarySuccessAction
  | FetchLibraryFailureAction
  | FetchLibraryCacheAction
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
  | RemoveFromFavoriteAction;
