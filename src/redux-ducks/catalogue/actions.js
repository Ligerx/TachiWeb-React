// @flow

// ================================================================================
// Fetch Catalogue
// ================================================================================

// Action Constants and Types
export const FETCH_CATALOGUE = "catalogue/FETCH";

export const FETCH_CATALOGUE_REQUEST = "catalogue/FETCH_REQUEST";
type FETCH_CATALOGUE_REQUEST_TYPE = "catalogue/FETCH_REQUEST";

export const FETCH_CATALOGUE_SUCCESS = "catalogue/FETCH_SUCCESS";
type FETCH_CATALOGUE_SUCCESS_TYPE = "catalogue/FETCH_SUCCESS";

export const FETCH_CATALOGUE_FAILURE = "catalogue/FETCH_FAILURE";
type FETCH_CATALOGUE_FAILURE_TYPE = "catalogue/FETCH_FAILURE";

// Action Object Types
type FetchCatalogueRequestAction = {
  type: FETCH_CATALOGUE_REQUEST_TYPE,
  meta: Object
};

type FetchCatalogueSuccessAction =
  | {
      type: FETCH_CATALOGUE_SUCCESS_TYPE,
      mangaIds: Array<number>,
      page: number,
      hasNextPage: boolean
    }
  | {
      type: FETCH_CATALOGUE_SUCCESS_TYPE,
      sourceIdChanged: boolean
    };

type FetchCatalogueFailureAction = {
  type: FETCH_CATALOGUE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Fetch the next catalogue page
// ================================================================================

// Action Constants and Types
export const CATALOGUE_ADD_PAGE = "catalogue/ADD_PAGE";

export const ADD_PAGE_REQUEST = "catalogue/ADD_PAGE_REQUEST";
type ADD_PAGE_REQUEST_TYPE = "catalogue/ADD_PAGE_REQUEST";

export const ADD_PAGE_SUCCESS = "catalogue/ADD_PAGE_SUCCESS";
type ADD_PAGE_SUCCESS_TYPE = "catalogue/ADD_PAGE_SUCCESS";

export const ADD_PAGE_FAILURE = "catalogue/ADD_PAGE_FAILURE";
type ADD_PAGE_FAILURE_TYPE = "catalogue/ADD_PAGE_FAILURE";

// failsafe, don't use
export const ADD_PAGE_NO_NEXT_PAGE = "catalogue/ADD_PAGE_NO_NEXT_PAGE";
type ADD_PAGE_NO_NEXT_PAGE_TYPE = "catalogue/ADD_PAGE_NO_NEXT_PAGE";

type AddPageRequestAction = { type: ADD_PAGE_REQUEST_TYPE, meta: Object };

type AddPageSuccessAction = {
  type: ADD_PAGE_SUCCESS_TYPE,
  mangaIds: Array<number>,
  page: number,
  hasNextPage: boolean
};

type AddPageFailureAction = {
  type: ADD_PAGE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type AddPageNoNextPageAction = { type: ADD_PAGE_NO_NEXT_PAGE_TYPE };

// ================================================================================
// etc actions
// ================================================================================

export const RESET_STATE = "catalogue/RESET_STATE";
type RESET_STATE_TYPE = "catalogue/RESET_STATE";

export type ResetStateAction = { type: RESET_STATE_TYPE };

export const UPDATE_SEARCH_QUERY = "catalogue/UPDATE_SEARCH_QUERY";
type UPDATE_SEARCH_QUERY_TYPE = "catalogue/UPDATE_SEARCH_QUERY";

type UpdateSearchQueryAction = {
  type: UPDATE_SEARCH_QUERY_TYPE,
  searchQuery: string
};

export const CHANGE_SOURCEID = "catalogue/CHANGE_SOURCEID";
type CHANGE_SOURCEID_TYPE = "catalogue/CHANGE_SOURCEID";

export type ChangeSourceIdAction = {
  type: CHANGE_SOURCEID_TYPE,
  newSourceId: string
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type CatalogueAction =
  | FetchCatalogueRequestAction
  | FetchCatalogueSuccessAction
  | FetchCatalogueFailureAction
  | AddPageRequestAction
  | AddPageSuccessAction
  | AddPageFailureAction
  | AddPageNoNextPageAction
  | ResetStateAction
  | UpdateSearchQueryAction
  | ChangeSourceIdAction;
