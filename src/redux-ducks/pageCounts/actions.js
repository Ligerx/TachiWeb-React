// @flow

// ================================================================================
// Fetch Preferences
// ================================================================================

// Action Constants and Types
export const FETCH_REQUEST = "pageCounts/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "pageCounts/FETCH_REQUEST";

export const FETCH_SUCCESS = "pageCounts/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "pageCounts/FETCH_SUCCESS";

export const FETCH_FAILURE = "pageCounts/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "pageCounts/FETCH_FAILURE";

export const FETCH_CACHE = "pageCounts/FETCH_CACHE";
type FETCH_CACHE_TYPE = "pageCounts/FETCH_CACHE";

// Action Object Types
type FetchRequestAction = { type: FETCH_REQUEST_TYPE };

type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  chapterId: number,
  pageCount: number
};

type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchCacheAction = { type: FETCH_CACHE_TYPE };

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type PageCountsAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | FetchCacheAction;
