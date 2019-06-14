// @flow
import { Server } from "api";
import type { GlobalState, AnyAction, ThunkAction } from "redux-ducks/reducers";
import type { FilterAnyType } from "types/filters";
import type { MangaType } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import { createSelector } from "reselect";
import {
  selectMangaInfos,
  ADD_MANGA,
  type AddMangaAction
} from "redux-ducks/mangaInfos";
import { selectLastUsedFilters } from "redux-ducks/filters";
import { handleHTMLError, transformToMangaIdsArray } from "redux-ducks/utils";

// ================================================================================
// Actions
// ================================================================================
export const RESET_STATE = "catalogue/RESET_STATE";
type RESET_STATE_TYPE = "catalogue/RESET_STATE";

export type ResetStateAction = { type: RESET_STATE_TYPE };

const FETCH_CATALOGUE = "catalogue/FETCH";
const FETCH_CATALOGUE_REQUEST = "catalogue/FETCH_REQUEST";
type FETCH_CATALOGUE_REQUEST_TYPE = "catalogue/FETCH_REQUEST";
const FETCH_CATALOGUE_SUCCESS = "catalogue/FETCH_SUCCESS";
type FETCH_CATALOGUE_SUCCESS_TYPE = "catalogue/FETCH_SUCCESS";
const FETCH_CATALOGUE_FAILURE = "catalogue/FETCH_FAILURE";
type FETCH_CATALOGUE_FAILURE_TYPE = "catalogue/FETCH_FAILURE";

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

const CATALOGUE_ADD_PAGE = "catalogue/ADD_PAGE";
const ADD_PAGE_REQUEST = "catalogue/ADD_PAGE_REQUEST";
type ADD_PAGE_REQUEST_TYPE = "catalogue/ADD_PAGE_REQUEST";
const ADD_PAGE_SUCCESS = "catalogue/ADD_PAGE_SUCCESS";
type ADD_PAGE_SUCCESS_TYPE = "catalogue/ADD_PAGE_SUCCESS";
const ADD_PAGE_FAILURE = "catalogue/ADD_PAGE_FAILURE";
type ADD_PAGE_FAILURE_TYPE = "catalogue/ADD_PAGE_FAILURE";
const ADD_PAGE_NO_NEXT_PAGE = "catalogue/ADD_PAGE_NO_NEXT_PAGE"; // failsafe, don't use
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

const UPDATE_SEARCH_QUERY = "catalogue/UPDATE_SEARCH_QUERY";
type UPDATE_SEARCH_QUERY_TYPE = "catalogue/UPDATE_SEARCH_QUERY";

type UpdateSearchQueryAction = {
  type: UPDATE_SEARCH_QUERY_TYPE,
  searchQuery: string
};

const CHANGE_SOURCEID = "catalogue/CHANGE_SOURCEID";
type CHANGE_SOURCEID_TYPE = "catalogue/CHANGE_SOURCEID";

export type ChangeSourceIdAction = {
  type: CHANGE_SOURCEID_TYPE,
  newSourceId: string
};

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnly<{
  sourceId: ?string,
  mangaIds: $ReadOnlyArray<number>,
  page: number,
  hasNextPage: boolean,
  searchQuery: string
}>;
export type Action =
  | ResetStateAction
  | FetchCatalogueRequestAction
  | FetchCatalogueSuccessAction
  | FetchCatalogueFailureAction
  | AddPageRequestAction
  | AddPageSuccessAction
  | AddPageFailureAction
  | AddPageNoNextPageAction
  | UpdateSearchQueryAction
  | ChangeSourceIdAction;

const initialState: State = {
  sourceId: null,
  mangaIds: [], // array of mangaIds that point that data loaded in mangaInfos reducer
  page: 1,
  hasNextPage: false,
  searchQuery: ""
};

export default function catalogueReducer(
  state: State = initialState,
  action: AnyAction
): State {
  switch (action.type) {
    case RESET_STATE:
      return initialState;

    case FETCH_CATALOGUE_REQUEST:
      return { ...state, mangaIds: [] }; // also clear manga shown when loading

    case FETCH_CATALOGUE_SUCCESS: {
      const { mangaIds, hasNextPage, sourceIdChanged } = action;

      if (sourceIdChanged) return state;

      return {
        ...state,
        mangaIds,
        hasNextPage
      };
    }

    case ADD_PAGE_SUCCESS: {
      const { mangaIds, page, hasNextPage } = action;
      return {
        ...state,
        // some sources send duplicate results for some reason, so only add unique values
        mangaIds: addUnique(state.mangaIds, mangaIds),
        page,
        hasNextPage
      };
    }

    case UPDATE_SEARCH_QUERY:
      return { ...state, searchQuery: action.searchQuery };

    case CHANGE_SOURCEID:
      return { ...state, sourceId: action.newSourceId };

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsCatalogueLoading = createLoadingSelector([
  FETCH_CATALOGUE,
  CATALOGUE_ADD_PAGE
]);

export const selectCatalogue = (state: GlobalState): State => state.catalogue;

export const selectCatalogueSourceId = (state: GlobalState): ?string =>
  state.catalogue.sourceId;

export const selectCatalogueMangaIds = (
  state: GlobalState
): $ReadOnlyArray<number> => state.catalogue.mangaIds;

export const selectCatalogueHasNextPage = (state: GlobalState): boolean =>
  state.catalogue.hasNextPage;

export const selectCatalogueSearchQuery = (state: GlobalState): string =>
  state.catalogue.searchQuery;

export const selectCatalogueMangaInfos = createSelector(
  [selectMangaInfos, selectCatalogueMangaIds],
  (mangaInfos, mangaIds): Array<MangaType> => {
    return mangaIds.map(mangaId => mangaInfos[mangaId]);
  }
);

// unused
export const selectCataloguePage = (state: GlobalState): number =>
  state.catalogue.page;

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
    return fetch(
      Server.catalogue(),
      cataloguePostParameters(1, sourceId, searchQuery.trim(), filtersChecked)
    )
      .then(handleHTMLError)
      .then(
        json => {
          // If we get an ajax response for source A but it completes after
          // we switch to source B, don't update the store
          const currentSourceId = selectCatalogueSourceId(getState());
          if (currentSourceId !== sourceId) {
            dispatch({ type: FETCH_CATALOGUE_SUCCESS, sourceIdChanged: true });
            return;
          }

          const { content, has_next: hasNextPage } = json;

          // content is sometimes undefined. Difficult to reproduce bug from the server
          const mangaArray = content || [];
          const mangaIds = transformToMangaIdsArray(mangaArray);

          dispatch({ type: ADD_MANGA, newManga: mangaArray });
          dispatch({
            type: FETCH_CATALOGUE_SUCCESS,
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
    return fetch(
      Server.catalogue(),
      cataloguePostParameters(
        nextPage,
        sourceId,
        searchQuery.trim(),
        filtersChecked
      )
    )
      .then(handleHTMLError)
      .then(
        json => {
          const { content, has_next: hasNextPageUpdated } = json;

          // content is sometimes undefined. Difficult to reproduce bug from the server
          const mangaArray = content || [];
          const mangaIds = transformToMangaIdsArray(mangaArray);

          dispatch({ type: ADD_MANGA, newManga: mangaArray });
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
function cataloguePostParameters(
  page: number,
  sourceId: string,
  query: string,
  filters: ?$ReadOnlyArray<FilterAnyType>
) {
  return {
    method: "POST",
    body: JSON.stringify({
      page,
      sourceId,
      query,
      filters
    }),
    headers: new Headers({
      "Content-Type": "application/json"
    })
  };
}

function addUnique(oldArray, newArray) {
  const newUniques = newArray.filter(val => !oldArray.includes(val));
  return [...oldArray, ...newUniques];
}
