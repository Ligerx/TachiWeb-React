// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import type { CataloguePageRequest } from "@tachiweb/api-client";
import type { FilterAnyType } from "types/filters";
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
export function fetchCatalogue(sourceId: string): ThunkAction {
  return (dispatch, getState) => {
    const searchQuery = selectCatalogueSearchQuery(getState());
    // Expected to be [] when searching all and on first load for individual catalogue
    const lastUsedFilters = selectLastUsedFilters(getState());

    dispatch({
      type: FETCH_CATALOGUE_REQUEST,
      meta: { sourceId, searchQuery, lastUsedFilters }
    });

    if (sourceId == null || sourceId === "") {
      return dispatch({
        type: FETCH_CATALOGUE_FAILURE,
        errorMessage: "Can't get catalogue because no source was selected",
        meta: { error: sourceId }
      });
    }

    // Filters should be null if empty when requesting from the server
    const filtersChecked = lastUsedFilters.length > 0 ? lastUsedFilters : null;

    return Server.api()
      .getSourceCatalogue(
        sourceId,
        catalogueRequest(1, searchQuery.trim(), filtersChecked)
      )
      .then(
        page => {
          const { mangas, hasNextPage } = page;

          dispatch({ type: ADD_MANGA, newManga: mangas });
          dispatch({
            type: FETCH_CATALOGUE_SUCCESS,
            payload: {
              mangaIds: mangas.map(manga => manga.id),
              page: 1,
              hasNextPage
            }
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
  query: string,
  filters: ?$ReadOnlyArray<FilterAnyType>
): CataloguePageRequest {
  const request: CataloguePageRequest = {
    page,
    query
  };

  // filters field cannot exist in request if no filters (even null is not allowed)
  if (filters != null) {
    request.filters = JSON.stringify(filters);
  }

  return request;
}
