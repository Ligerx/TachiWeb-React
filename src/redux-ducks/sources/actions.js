// @flow
import type { Source } from "@tachiweb/api-client";

// ================================================================================
// Fetch Sources
// ================================================================================

// Action Constants and Types
export const FETCH_SOURCES = "sources/FETCH";

export const FETCH_REQUEST = "sources/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "sources/FETCH_REQUEST";

export const FETCH_SUCCESS = "sources/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "sources/FETCH_SUCCESS";

export const FETCH_FAILURE = "sources/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "sources/FETCH_FAILURE";

export const FETCH_CACHE = "sources/FETCH_CACHE";
type FETCH_CACHE_TYPE = "sources/FETCH_CACHE";

// Action Object Types
type FetchRequestAction = { type: FETCH_REQUEST_TYPE };

type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  payload: Array<Source>
};

type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchCacheAction = { type: FETCH_CACHE_TYPE };

// ================================================================================
// etc actions
// ================================================================================

export const RESET_SOURCES = "sources/RESET_SOURCES";
type RESET_SOURCES_TYPE = "sources/RESET_SOURCES";

type ResetSourcesAction = { type: RESET_SOURCES_TYPE };

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type SourcesAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | FetchCacheAction
  | ResetSourcesAction;
