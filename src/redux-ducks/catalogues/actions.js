// @flow

// ================================================================================
// Fetch Catalogue
// ================================================================================

// Action Constants and Types
export const FETCH_CATALOGUE = "catalogues/FETCH";

export const FETCH_CATALOGUE_REQUEST = "catalogues/FETCH_REQUEST";
type FETCH_CATALOGUE_REQUEST_TYPE = "catalogues/FETCH_REQUEST";

export const FETCH_CATALOGUE_SUCCESS = "catalogues/FETCH_SUCCESS";
type FETCH_CATALOGUE_SUCCESS_TYPE = "catalogues/FETCH_SUCCESS";

export const FETCH_CATALOGUE_FAILURE = "catalogues/FETCH_FAILURE";
type FETCH_CATALOGUE_FAILURE_TYPE = "catalogues/FETCH_FAILURE";

export const FETCH_CACHE = "catalogues/FETCH_CACHE";
type FETCH_CACHE_TYPE = "catalogues/FETCH_CACHE";

export const FETCH_CATALOGUE_NO_NEXT_PAGE =
  "catalogues/FETCH_CATALOGUE_NO_NEXT_PAGE";
type FETCH_CATALOGUE_NO_NEXT_PAGE_TYPE =
  "catalogues/FETCH_CATALOGUE_NO_NEXT_PAGE";

// Action Object Types
type FetchCatalogueRequestAction = {
  type: FETCH_CATALOGUE_REQUEST_TYPE,
  payload: { sourceId: string, page: number },
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

type FetchCacheAction = { type: FETCH_CACHE_TYPE };

type FetchCatalogueNoNextPageAction = {
  type: FETCH_CATALOGUE_NO_NEXT_PAGE_TYPE
};

// ================================================================================
// etc actions
// ================================================================================

export const UPDATE_SEARCH_QUERY = "catalogues/UPDATE_SEARCH_QUERY";
type UPDATE_SEARCH_QUERY_TYPE = "catalogues/UPDATE_SEARCH_QUERY";

export type UpdateSearchQueryAction = {
  type: UPDATE_SEARCH_QUERY_TYPE,
  payload: {
    searchQuery: string
  }
};

export const RESET_CATALOGUES = "catalogues/RESET_CATALOGUES";
type RESET_CATALOGUES_TYPE = "catalogues/RESET_CATALOGUES";

export type ResetCataloguesAction = {
  type: RESET_CATALOGUES_TYPE
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type CataloguesAction =
  | FetchCatalogueRequestAction
  | FetchCatalogueSuccessAction
  | FetchCatalogueFailureAction
  | FetchCacheAction
  | FetchCatalogueNoNextPageAction
  | UpdateSearchQueryAction
  | ResetCataloguesAction;
