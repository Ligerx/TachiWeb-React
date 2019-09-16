// @flow
import produce from "immer";
import { createSelector } from "reselect";
import type { Manga } from "@tachiweb/api-client";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { createLoadingSelector } from "redux-ducks/loading";
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
type CatalogueType = {
  page: number,
  hasNextPage: boolean,
  mangaIds: Array<number> // array of mangaIds that point that data in the mangaInfos reducer
};

type State = {
  // storing this as a sort of global variable that gets regularly cleared when you switch catalogues
  searchQuery: string,

  bySourceId: {
    [sourceId: string]: CatalogueType
  },

  // Handling loading states here instead of loading reducer because you could be
  // fetching from multiple sources at the same time
  loadingSourceIds: Array<string>
};

const initialState: State = {
  searchQuery: "",
  bySourceId: {},
  loadingSourceIds: []
};

export default function cataloguesReducer(
  state: State = initialState,
  action: Action
): State {
  // Mutate Immer 'draft' to get an immutable copy of the new state
  /* eslint-disable no-param-reassign */
  return produce(state, draft => {
    switch (action.type) {
      // case RESET_STATE:
      //   return initialState;

      // case FETCH_CATALOGUE_REQUEST:
      //   return { ...state, mangaIds: [] }; // also clear manga shown when loading

      // case FETCH_CATALOGUE_SUCCESS: {
      //   const { didSourceIdChange, mangaIds, hasNextPage } = action;

      //   if (didSourceIdChange) return state;

      //   return {
      //     ...state,
      //     mangaIds,
      //     hasNextPage
      //   };
      // }

      // case ADD_PAGE_SUCCESS: {
      //   const { mangaIds, page, hasNextPage } = action;
      //   return {
      //     ...state,
      //     // some sources send duplicate results for some reason, so only add unique values
      //     mangaIds: addUnique(state.mangaIds, mangaIds),
      //     page,
      //     hasNextPage
      //   };
      // }

      // case UPDATE_SEARCH_QUERY:
      //   return { ...state, searchQuery: action.searchQuery };

      // case CHANGE_SOURCEID:
      //   return { ...state, sourceId: action.newSourceId };

      default:
        return state;
    }
  });
  /* eslint-enable no-param-reassign */
}

// ================================================================================
// Selectors
// ================================================================================

export const selectCatalogueBySourceId = (
  state: GlobalState,
  sourceId: string
): CatalogueType => state.catalogues.bySourceId[sourceId];

// export const selectIsCatalogueLoading = createLoadingSelector([
//   FETCH_CATALOGUE,
//   CATALOGUE_ADD_PAGE
// ]);

// export const selectCatalogue = (state: GlobalState): State => state.catalogue;

// export const selectCatalogueSourceId = (state: GlobalState): ?string =>
//   state.catalogue.sourceId;

// export const selectCatalogueMangaIds = (
//   state: GlobalState
// ): $ReadOnlyArray<number> => state.catalogue.mangaIds;

// export const selectCatalogueHasNextPage = (state: GlobalState): boolean =>
//   state.catalogue.hasNextPage;

// export const selectCatalogueSearchQuery = (state: GlobalState): string =>
//   state.catalogue.searchQuery;

// export const selectCatalogueMangaInfos: GlobalState => $ReadOnlyArray<Manga> = createSelector(
//   [selectMangaInfos, selectCatalogueMangaIds],
//   (mangaInfos, mangaIds): $ReadOnlyArray<Manga> => {
//     return mangaIds.map(mangaId => mangaInfos[mangaId]);
//   }
// );

// // unused
// export const selectCataloguePage = (state: GlobalState): number =>
//   state.catalogue.page;

// ================================================================================
// Helper Functions
// ================================================================================
function addUnique(oldArray, newArray) {
  const newUniques = newArray.filter(val => !oldArray.includes(val));
  return [...oldArray, ...newUniques];
}
