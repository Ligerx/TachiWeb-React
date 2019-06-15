// @flow
import type { ChapterType } from "types";

// ================================================================================
// Fetch Chapters
// ================================================================================

// Action Constants and Types
export const FETCH_CHAPTERS = "chapters/FETCH";

export const FETCH_REQUEST = "chapters/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "chapters/FETCH_REQUEST";

export const FETCH_SUCCESS = "chapters/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "chapters/FETCH_SUCCESS";

export const FETCH_FAILURE = "chapters/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "chapters/FETCH_FAILURE";

export const FETCH_CACHE = "chapters/FETCH_CACHE";
type FETCH_CACHE_TYPE = "chapters/FETCH_CACHE";

// Action Object Types
type FetchRequestAction = { type: FETCH_REQUEST_TYPE, meta: Object };

type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  payload: Array<ChapterType>,
  mangaId: number
};

type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchCacheAction = { type: FETCH_CACHE_TYPE };

// ================================================================================
// Update Chapters
// ================================================================================

// Action Constants and Types
export const UPDATE_CHAPTERS = "chapters/UPDATE";

export const UPDATE_REQUEST = "chapters/UPDATE_REQUEST";
type UPDATE_REQUEST_TYPE = "chapters/UPDATE_REQUEST";

export const UPDATE_SUCCESS = "chapters/UPDATE_SUCCESS";
type UPDATE_SUCCESS_TYPE = "chapters/UPDATE_SUCCESS";

export const UPDATE_FAILURE = "chapters/UPDATE_FAILURE";
type UPDATE_FAILURE_TYPE = "chapters/UPDATE_FAILURE";

// Action Object Types
type UpdateRequestAction = { type: UPDATE_REQUEST_TYPE, meta: Object };

type UpdateSuccessAction = {
  // call fetchChapters() after UpdateSuccessAction if there were new manga added
  type: UPDATE_SUCCESS_TYPE,
  meta: Object
};

type UpdateFailureAction = {
  type: UPDATE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Update a chapter's reading status
// ================================================================================

// Action Constants and Types
export const UPDATE_READING_STATUS_REQUEST =
  "chapters/UPDATE_READING_STATUS_REQUEST";
type UPDATE_READING_STATUS_REQUEST_TYPE =
  "chapters/UPDATE_READING_STATUS_REQUEST";

export const UPDATE_READING_STATUS_SUCCESS =
  "chapters/UPDATE_READING_STATUS_SUCCESS";
type UPDATE_READING_STATUS_SUCCESS_TYPE =
  "chapters/UPDATE_READING_STATUS_SUCCESS";

export const UPDATE_READING_STATUS_FAILURE =
  "chapters/UPDATE_READING_STATUS_FAILURE";
type UPDATE_READING_STATUS_FAILURE_TYPE =
  "chapters/UPDATE_READING_STATUS_FAILURE";

export const UPDATE_READING_STATUS_NO_CHANGE =
  "chapters/UPDATE_READING_STATUS_NO_CHANGE";
type UPDATE_READING_STATUS_NO_CHANGE_TYPE =
  "chapters/UPDATE_READING_STATUS_NO_CHANGE";

// Action Object Types
type UpdateReadingStatusRequestAction = {
  type: UPDATE_READING_STATUS_REQUEST_TYPE,
  meta: Object
};

type UpdateReadingStatusSuccessAction = {
  type: UPDATE_READING_STATUS_SUCCESS_TYPE,
  mangaId: number,
  chapterId: number,
  readPage: number,
  didReadLastPage: boolean
};

type UpdateReadingStatusFailureAction = {
  type: UPDATE_READING_STATUS_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type UpdateReadingStatusNoChangeAction = {
  type: UPDATE_READING_STATUS_NO_CHANGE_TYPE,
  meta: Object
};

// ================================================================================
// Toggle if a chapter is read
// ================================================================================

// Action Constants and Types
export const TOGGLE_READ_REQUEST = "chapters/TOGGLE_READ_REQUEST";
type TOGGLE_READ_REQUEST_TYPE = "chapters/TOGGLE_READ_REQUEST";

export const TOGGLE_READ_SUCCESS = "chapters/TOGGLE_READ_SUCCESS";
type TOGGLE_READ_SUCCESS_TYPE = "chapters/TOGGLE_READ_SUCCESS";

export const TOGGLE_READ_FAILURE = "chapters/TOGGLE_READ_FAILURE";
type TOGGLE_READ_FAILURE_TYPE = "chapters/TOGGLE_READ_FAILURE";

// Action Object Types
type ToggleReadRequestAction = { type: TOGGLE_READ_REQUEST_TYPE, meta: Object };

type ToggleReadSuccessAction = {
  type: TOGGLE_READ_SUCCESS_TYPE,
  mangaId: number,
  chapterId: number,
  read: boolean
};

type ToggleReadFailureAction = {
  type: TOGGLE_READ_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type ChaptersAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | FetchCacheAction
  | UpdateRequestAction
  | UpdateSuccessAction
  | UpdateFailureAction
  | UpdateReadingStatusRequestAction
  | UpdateReadingStatusSuccessAction
  | UpdateReadingStatusFailureAction
  | UpdateReadingStatusNoChangeAction
  | ToggleReadRequestAction
  | ToggleReadSuccessAction
  | ToggleReadFailureAction;
