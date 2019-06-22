// @flow
import type { CategoryType } from "types";

// ================================================================================
// Fetch Categories
// ================================================================================

// Action Constants and Types
export const FETCH_REQUEST = "categories/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "categories/FETCH_REQUEST";

export const FETCH_SUCCESS = "categories/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "categories/FETCH_SUCCESS";

export const FETCH_FAILURE = "categories/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "categories/FETCH_FAILURE";

export const FETCH_CACHE = "categories/FETCH_CACHE";
type FETCH_CACHE_TYPE = "categories/FETCH_CACHE";

// Action Object Types
type FetchRequestAction = { type: FETCH_REQUEST_TYPE };

type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  categories: $ReadOnlyArray<CategoryType>
};

type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchCacheAction = { type: FETCH_CACHE_TYPE };

// ================================================================================
// etc
// ================================================================================
export const CHANGE_CURRENT_CATEGORY_ID =
  "categories/CHANGE_CURRENT_CATEGORY_ID";
type CHANGE_CURRENT_CATEGORY_ID_TYPE = "categories/CHANGE_CURRENT_CATEGORY_ID";

export type ChangeCurrentCategoryIdAction = {
  type: CHANGE_CURRENT_CATEGORY_ID_TYPE,
  categoryId: ?number
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type CategoriesAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | FetchCacheAction
  | ChangeCurrentCategoryIdAction;
