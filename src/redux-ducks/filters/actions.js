// @flow
import type { FilterAnyType } from "types/filters";

// ================================================================================
// Fetch Filters
// ================================================================================

// Action Constants and Types
export const FETCH_FILTERS = "filters/FETCH";

export const FETCH_REQUEST = "filters/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "filters/FETCH_REQUEST";

export const FETCH_SUCCESS = "filters/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "filters/FETCH_SUCCESS";

export const FETCH_FAILURE = "filters/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "filters/FETCH_FAILURE";

// Action Object Types
type FetchRequestAction = { type: FETCH_REQUEST_TYPE, meta: Object };

type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  filters: Array<FilterAnyType>
};

type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Manage Local Filters
// ================================================================================

// Action Constants and Types
export const REVERT_TO_INITIAL_FILTERS = "filters/REVERT_TO_INITIAL_FILTERS";
type REVERT_TO_INITIAL_FILTERS_TYPE = "filters/REVERT_TO_INITIAL_FILTERS";

export const UPDATE_LAST_USED_FILTERS = "filters/UPDATE_LAST_USED_FILTERS";
type UPDATE_LAST_USED_FILTERS_TYPE = "filters/UPDATE_LAST_USED_FILTERS";

export const UPDATE_CURRENT_FILTERS = "filters/UPDATE_CURRENT_FILTERS";
type UPDATE_CURRENT_FILTERS_TYPE = "filters/UPDATE_CURRENT_FILTERS";

// Action Object Types
export type RevertToInitialFiltersAction = {
  type: REVERT_TO_INITIAL_FILTERS_TYPE
};

export type UpdateLastUsedFiltersAction = {
  type: UPDATE_LAST_USED_FILTERS_TYPE
};

export type UpdateCurrentFiltersAction = {
  type: UPDATE_CURRENT_FILTERS_TYPE,
  filters: Array<FilterAnyType>
};

// ================================================================================
// Update Filters
// ================================================================================

export const UPDATE_FILTER = "filters/UPDATE_FILTER";
type UPDATE_FILTER_TYPE = "filters/UPDATE_FILTER";

type UpdateFilterAction = {
  type: UPDATE_FILTER_TYPE,
  filter: FilterAnyType,
  index: number
};

// ================================================================================
// etc
// ================================================================================

export const RESET_FILTERS = "filters/RESET_FILTERS";
type RESET_FILTERS_TYPE = "filters/RESET_FILTERS";

export type ResetFiltersAction = { type: RESET_FILTERS_TYPE };

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type FiltersAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | RevertToInitialFiltersAction
  | UpdateLastUsedFiltersAction
  | UpdateCurrentFiltersAction
  | UpdateFilterAction
  | ResetFiltersAction;
