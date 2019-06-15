// @flow
import type { SourceType } from "types";

// ================================================================================
// Action Constants and Types
// ================================================================================
export const FETCH_SOURCES = "sources/FETCH";

export const FETCH_REQUEST = "sources/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "sources/FETCH_REQUEST";

export const FETCH_SUCCESS = "sources/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "sources/FETCH_SUCCESS";

export const FETCH_FAILURE = "sources/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "sources/FETCH_FAILURE";

// ================================================================================
// Action Object Types
// ================================================================================
type FetchRequestAction = { type: FETCH_REQUEST_TYPE };

type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  payload: $ReadOnlyArray<SourceType>
};

type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

export type SourcesAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction;
