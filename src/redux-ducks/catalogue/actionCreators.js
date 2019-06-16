// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import type { CataloguePageRequest } from "@tachiweb/api-client";
import { ADD_MANGA } from "redux-ducks/mangaInfos/actions";
import { selectLastUsedFilters } from "redux-ducks/filters";
import { transformToMangaIdsArray } from "redux-ducks/utils";
import {
  selectCatalogueSearchQuery,
  selectCatalogueSourceId,
  selectCatalogue
} from ".";
import {
  FETCH_CATALOGUE_REQUEST,
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_SUCCESS,
  ADD_PAGE_NO_NEXT_PAGE,
  ADD_PAGE_FAILURE,
  ADD_PAGE_REQUEST,
  ADD_PAGE_SUCCESS,
  RESET_STATE,
  UPDATE_SEARCH_QUERY,
  CHANGE_SOURCEID,
  type ResetStateAction,
  type UpdateSearchQueryAction,
  type ChangeSourceIdAction
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
export function fetchCatalogue(): ThunkAction {
  return (dispatch, getState) => {
    const lastUsedFilters = selectLastUsedFilters(getState());
    const searchQuery = selectCatalogueSearchQuery(getState());
    const sourceId = selectCatalogueSourceId(getState());

    dispatch({
      type: FETCH_CATALOGUE_REQUEST,
      meta: { sourceId, searchQuery, lastUsedFilters }
    });

    if (sourceId == null) {
      return dispatch({
        type: FETCH_CATALOGUE_FAILURE,
        errorMessage: "No source selected",
        meta: { error: "fetchCatalogue() sourceId is null" }
      });
    }

    // Filters should be null if empty when requesting from the server
    const filtersChecked = lastUsedFilters.length ? lastUsedFilters : null;
    return Server.api()
      .getSourceCatalogue(
        sourceId,
        catalogueRequest(1, searchQuery.trim(), filtersChecked)
      )
      .then(
        page => {
          // If we get an ajax response for source A but it completes after
          // we switch to source B, don't update the store
          const currentSourceId = selectCatalogueSourceId(getState());
          const didSourceIdChange = currentSourceId !== sourceId;

          const { mangas, hasNextPage } = page;

          const mangaIds = transformToMangaIdsArray(mangas);

          dispatch({ type: ADD_MANGA, newManga: mangas });
          dispatch({
            type: FETCH_CATALOGUE_SUCCESS,
            didSourceIdChange,
            mangaIds,
            page: 1,
            hasNextPage
          });
        },
        error =>
          dispatch({
            type: FETCH_CATALOGUE_FAILURE,
            errorMessage: "Failed to load this catalogue",
            meta: { error }
          })
      );
  };
}

export function fetchNextCataloguePage(): ThunkAction {
  return (dispatch, getState) => {
    const { page, hasNextPage, searchQuery, sourceId } = selectCatalogue(
      getState()
    );
    const lastUsedFilters = selectLastUsedFilters(getState());
    const nextPage = page + 1;

    if (!hasNextPage) {
      // Failsafe - don't actually call this function if there is no next page
      return dispatch({ type: ADD_PAGE_NO_NEXT_PAGE });
    }
    if (sourceId == null) {
      return dispatch({
        type: ADD_PAGE_FAILURE,
        errorMessage: "There was a problem loading the next page of manga",
        meta: { error: "fetchNextCataloguePage() sourceId is null" }
      });
    }

    dispatch({
      type: ADD_PAGE_REQUEST,
      meta: {
        sourceId,
        nextPage,
        hasNextPage,
        searchQuery,
        lastUsedFilters
      }
    });

    const filtersChecked = lastUsedFilters.length ? lastUsedFilters : null;
    return Server.api()
      .getSourceCatalogue(
        sourceId,
        catalogueRequest(nextPage, searchQuery.trim(), filtersChecked)
      )
      .then(
        newPage => {
          const { mangas, hasNextPage: hasNextPageUpdated } = newPage;

          const mangaIds = transformToMangaIdsArray(mangas);

          dispatch({ type: ADD_MANGA, newManga: mangas });
          dispatch({
            type: ADD_PAGE_SUCCESS,
            mangaIds,
            page: nextPage,
            hasNextPage: hasNextPageUpdated
          });
        },
        error =>
          dispatch({
            type: ADD_PAGE_FAILURE,
            errorMessage: "There was a problem loading the next page of manga",
            meta: { error }
          })
      );
  };
}

export function resetCatalogue(): ResetStateAction {
  return { type: RESET_STATE };
}

export function updateSearchQuery(
  newSearchQuery: string
): UpdateSearchQueryAction {
  return { type: UPDATE_SEARCH_QUERY, searchQuery: newSearchQuery };
}

export function changeSourceId(newSourceId: string): ChangeSourceIdAction {
  return { type: CHANGE_SOURCEID, newSourceId };
}

// ================================================================================
// Helper Functions
// ================================================================================
function catalogueRequest(
  page: number,
  query?: string,
  filters?: Object
): CataloguePageRequest {
  const request: CataloguePageRequest = {
    page,
    query
  };

  // filters field cannot exist in request if no filters (even null is not allowed)
  if (filters != null) request.filters = JSON.stringify(filters);

  return request;
}
