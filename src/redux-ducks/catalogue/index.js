// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { MangaType } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import { createSelector } from "reselect";
import { selectMangaInfos } from "redux-ducks/mangaInfos";
import {
  RESET_STATE,
  FETCH_CATALOGUE_REQUEST,
  FETCH_CATALOGUE_SUCCESS,
  ADD_PAGE_SUCCESS,
  UPDATE_SEARCH_QUERY,
  CHANGE_SOURCEID,
  FETCH_CATALOGUE,
  CATALOGUE_ADD_PAGE
} from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  sourceId: ?string,
  mangaIds: $ReadOnlyArray<number>,
  page: number,
  hasNextPage: boolean,
  searchQuery: string
}>;

const initialState: State = {
  sourceId: null,
  mangaIds: [], // array of mangaIds that point that data loaded in mangaInfos reducer
  page: 1,
  hasNextPage: false,
  searchQuery: ""
};

export default function catalogueReducer(
  state: State = initialState,
  action: Action
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
// Helper Functions
// ================================================================================
function addUnique(oldArray, newArray) {
  const newUniques = newArray.filter(val => !oldArray.includes(val));
  return [...oldArray, ...newUniques];
}
