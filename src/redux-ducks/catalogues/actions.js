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

type FetchCatalogueNoNextPageAction = {
  type: FETCH_CATALOGUE_NO_NEXT_PAGE_TYPE
};

// ================================================================================
// etc actions
// ================================================================================

export const UPDATE_SEARCH_QUERY = "catalogue/UPDATE_SEARCH_QUERY";
type UPDATE_SEARCH_QUERY_TYPE = "catalogue/UPDATE_SEARCH_QUERY";

export type UpdateSearchQueryAction = {
  type: UPDATE_SEARCH_QUERY_TYPE,
  payload: {
    searchQuery: string
  }
};

export const RESET_CATALOGUE_FOR_SOURCEIDS =
  "catalogue/RESET_CATALOGUE_FOR_SOURCEIDS";
type RESET_CATALOGUE_FOR_SOURCEIDS_TYPE =
  "catalogue/RESET_CATALOGUE_FOR_SOURCEIDS";

export type ResetCatalogueForSourceIdsAction = {
  type: RESET_CATALOGUE_FOR_SOURCEIDS_TYPE,
  payload: { sourceIds: string | Array<string> }
};

export const RESET_CATALOGUES_TO_INIT = "catalogue/RESET_CATALOGUES_TO_INIT";
type RESET_CATALOGUES_TO_INIT_TYPE = "catalogue/RESET_CATALOGUES_TO_INIT";

export type ResetCataloguesToInitAction = {
  type: RESET_CATALOGUES_TO_INIT_TYPE
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type CataloguesAction =
  | FetchCatalogueRequestAction
  | FetchCatalogueSuccessAction
  | FetchCatalogueFailureAction
  | FetchCatalogueNoNextPageAction
  | UpdateSearchQueryAction
  | ResetCatalogueForSourceIdsAction
  | ResetCataloguesToInitAction;
