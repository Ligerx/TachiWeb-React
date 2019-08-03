// @flow
import type { CategoryType } from "types";

// ================================================================================
// Fetch Categories
// ================================================================================

// Action Constants and Types
export const FETCH_CATEGORIES = "categories/FETCH";

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
// Create a category
// ================================================================================

// Action Constants and Types
export const CREATE_REQUEST = "categories/CREATE_REQUEST";
type CREATE_REQUEST_TYPE = "categories/CREATE_REQUEST";

export const CREATE_SUCCESS = "categories/CREATE_SUCCESS";
type CREATE_SUCCESS_TYPE = "categories/CREATE_SUCCESS";

export const CREATE_FAILURE = "categories/CREATE_FAILURE";
type CREATE_FAILURE_TYPE = "categories/CREATE_FAILURE";

// Action Object Types
type CreateRequestAction = { type: CREATE_REQUEST_TYPE };

type CreateSuccessAction = {
  type: CREATE_SUCCESS_TYPE,
  newCategory: CategoryType
};

type CreateFailureAction = {
  type: CREATE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Delete a category
// ================================================================================

// Action Constants and Types
export const DELETE_REQUEST = "categories/DELETE_REQUEST";
type DELETE_REQUEST_TYPE = "categories/DELETE_REQUEST";

export const DELETE_SUCCESS = "categories/DELETE_SUCCESS";
type DELETE_SUCCESS_TYPE = "categories/DELETE_SUCCESS";

export const DELETE_FAILURE = "categories/DELETE_FAILURE";
type DELETE_FAILURE_TYPE = "categories/DELETE_FAILURE";

// Action Object Types
type DeleteRequestAction = { type: DELETE_REQUEST_TYPE, categoryId: number };

type DeleteSuccessAction = { type: DELETE_SUCCESS_TYPE };

type DeleteFailureAction = {
  type: DELETE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Save new category name to server
// ================================================================================

// Action Constants and Types
export const UPDATE_CATEGORY_NAME_REQUEST =
  "categories/UPDATE_CATEGORY_NAME_REQUEST";
type UPDATE_CATEGORY_NAME_REQUEST_TYPE =
  "categories/UPDATE_CATEGORY_NAME_REQUEST";

export const UPDATE_CATEGORY_NAME_SUCCESS =
  "categories/UPDATE_CATEGORY_NAME_SUCCESS";
type UPDATE_CATEGORY_NAME_SUCCESS_TYPE =
  "categories/UPDATE_CATEGORY_NAME_SUCCESS";

export const UPDATE_CATEGORY_NAME_FAILURE =
  "categories/UPDATE_CATEGORY_NAME_FAILURE";
type UPDATE_CATEGORY_NAME_FAILURE_TYPE =
  "categories/UPDATE_CATEGORY_NAME_FAILURE";

// Action Object Types
type UpdateCategoryNameRequestAction = {
  type: UPDATE_CATEGORY_NAME_REQUEST_TYPE,
  categoryId: number,
  name: string
};

type UpdateCategoryNameSuccessAction = {
  type: UPDATE_CATEGORY_NAME_SUCCESS_TYPE
};

type UpdateCategoryNameFailureAction = {
  type: UPDATE_CATEGORY_NAME_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Edit the manga in a category
// ================================================================================

// Action Constants and Types
export const UPDATE_CATEGORY_MANGA_REQUEST =
  "categories/UPDATE_CATEGORY_MANGA_REQUEST";
type UPDATE_CATEGORY_MANGA_REQUEST_TYPE =
  "categories/UPDATE_CATEGORY_MANGA_REQUEST";

export const UPDATE_CATEGORY_MANGA_SUCCESS =
  "categories/UPDATE_CATEGORY_MANGA_SUCCESS";
type UPDATE_CATEGORY_MANGA_SUCCESS_TYPE =
  "categories/UPDATE_CATEGORY_MANGA_SUCCESS";

export const UPDATE_CATEGORY_MANGA_FAILURE =
  "categories/UPDATE_CATEGORY_MANGA_FAILURE";
type UPDATE_CATEGORY_MANGA_FAILURE_TYPE =
  "categories/UPDATE_CATEGORY_MANGA_FAILURE";

// Action Object Types
type UpdateCategoryMangaRequestAction = {
  type: UPDATE_CATEGORY_MANGA_REQUEST_TYPE,
  categoryId: number,
  mangaToAdd: Array<number>,
  mangaToRemove: Array<number>
};

type UpdateCategoryMangaSuccessAction = {
  type: UPDATE_CATEGORY_MANGA_SUCCESS_TYPE
};

type UpdateCategoryMangaFailureAction = {
  type: UPDATE_CATEGORY_MANGA_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

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
  | CreateRequestAction
  | CreateSuccessAction
  | CreateFailureAction
  | DeleteRequestAction
  | DeleteSuccessAction
  | DeleteFailureAction
  | UpdateCategoryNameRequestAction
  | UpdateCategoryNameSuccessAction
  | UpdateCategoryNameFailureAction
  | UpdateCategoryMangaRequestAction
  | UpdateCategoryMangaSuccessAction
  | UpdateCategoryMangaFailureAction
  | ChangeCurrentCategoryIdAction;
