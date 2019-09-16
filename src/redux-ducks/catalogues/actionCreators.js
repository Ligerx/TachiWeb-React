// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import type { CataloguePageRequest } from "@tachiweb/api-client";
import type { FilterAnyType } from "types/filters";
import { ADD_MANGA } from "redux-ducks/mangaInfos/actions";
import { selectLastUsedFilters } from "redux-ducks/filters";
import { selectCatalogueBySourceId, selectCatalogueSearchQuery } from ".";
import {
  FETCH_CATALOGUE_REQUEST,
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_SUCCESS,
  FETCH_CATALOGUE_NO_NEXT_PAGE,
  RESET_CATALOGUE,
  UPDATE_SEARCH_QUERY,
  type ResetCatalogueAction,
  type UpdateSearchQueryAction
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================

// Creating 2 functions to separate out the 'pure' function from any selectors
/**
 * Use this function for fetching the initial data as well as fetching additional data.
 */
export function fetchCatalogue(sourceId: string): ThunkAction {
  return (dispatch, getState) => {
    const searchQuery = selectCatalogueSearchQuery(getState());

    // Expected to be [] when searching all and on first load for individual catalogue
    const lastUsedFilters = selectLastUsedFilters(getState());

    const catalogue = selectCatalogueBySourceId(getState(), sourceId);
    const nextPage = catalogue == null ? 1 : catalogue.page + 1;
    const hasNextPage = catalogue == null ? true : catalogue.hasNextPage;

    if (!hasNextPage) {
      return dispatch({ type: FETCH_CATALOGUE_NO_NEXT_PAGE });
    }

    return dispatch(
      fetchCataloguePure(sourceId, nextPage, searchQuery, lastUsedFilters)
    );
  };
}

function fetchCataloguePure(
  sourceId: string,
  page: number,
  searchQuery: string,
  filters: $ReadOnlyArray<FilterAnyType>
): ThunkAction {
  return dispatch => {
    dispatch({
      type: FETCH_CATALOGUE_REQUEST,
      meta: { sourceId, page, searchQuery, filters }
    });

    // API expects null instead of empty array if there are no filters
    const filtersChecked = filters.length > 0 ? filters : null;

    return Server.api()
      .getSourceCatalogue(
        sourceId,
        catalogueRequest(page, searchQuery.trim(), filtersChecked)
      )
      .then(
        catalogueData => {
          const { mangas, hasNextPage } = catalogueData;

          dispatch({ type: ADD_MANGA, newManga: mangas });
          dispatch({
            type: FETCH_CATALOGUE_SUCCESS,
            payload: {
              sourceId,
              page,
              mangaIds: mangas.map(manga => manga.id),
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

export function resetCatalogue(sourceId: string): ResetCatalogueAction {
  return { type: RESET_CATALOGUE, payload: { sourceId } };
}

export function updateSearchQuery(
  searchQuery: string
): UpdateSearchQueryAction {
  return { type: UPDATE_SEARCH_QUERY, payload: { searchQuery } };
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
