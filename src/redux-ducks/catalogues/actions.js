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

export const FETCH_CATALOGUE_NO_NEXT_PAGE =
  "catalogue/FETCH_CATALOGUE_NO_NEXT_PAGE";
type FETCH_CATALOGUE_NO_NEXT_PAGE_TYPE =
  "catalogue/FETCH_CATALOGUE_NO_NEXT_PAGE";

// Action Object Types
type FetchCatalogueRequestAction = {
  type: FETCH_CATALOGUE_REQUEST_TYPE,
  meta: Object
};

type FetchCatalogueSuccessAction = {
  type: FETCH_CATALOGUE_SUCCESS_TYPE,
  payload: {
    sourceId: string,
    page: number,
    mangaIds: Array<number>,
    hasNextPage: boolean
  }
};

type FetchCatalogueFailureAction = {
  type: FETCH_CATALOGUE_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchCatalogueNoNextPageAction = {
  type: FETCH_CATALOGUE_NO_NEXT_PAGE_TYPE
};

// ================================================================================
// etc actions
// ================================================================================

export const RESET_CATALOGUE = "catalogue/RESET_CATALOGUE";
type RESET_CATALOGUE_TYPE = "catalogue/RESET_CATALOGUE";

export type ResetCatalogueAction = {
  type: RESET_CATALOGUE_TYPE,
  payload: { sourceId: string }
};

export const UPDATE_SEARCH_QUERY = "catalogue/UPDATE_SEARCH_QUERY";
type UPDATE_SEARCH_QUERY_TYPE = "catalogue/UPDATE_SEARCH_QUERY";

export type UpdateSearchQueryAction = {
  type: UPDATE_SEARCH_QUERY_TYPE,
  payload: {
    searchQuery: string
  }
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type CataloguesAction =
  | FetchCatalogueRequestAction
  | FetchCatalogueSuccessAction
  | FetchCatalogueFailureAction
  | FetchCatalogueNoNextPageAction
  | ResetCatalogueAction
  | UpdateSearchQueryAction;
