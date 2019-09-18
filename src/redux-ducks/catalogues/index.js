// @flow
import produce from "immer";
import createCachedSelector from "re-reselect";
import type { Manga } from "@tachiweb/api-client";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { selectMangaInfos } from "redux-ducks/mangaInfos";
import {
  FETCH_CATALOGUE_REQUEST,
  FETCH_CATALOGUE_SUCCESS,
  UPDATE_SEARCH_QUERY,
  RESET_CATALOGUE_FOR_SOURCEIDS,
  RESET_CATALOGUES_TO_INIT
} from "./actions";

// ================================================================================
// Reducer
// ================================================================================
export type CatalogueType = {
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
  /* eslint-disable no-param-reassign, consistent-return */
  return produce(state, draft => {
    switch (action.type) {
      case FETCH_CATALOGUE_REQUEST: {
        const { sourceId, page } = action.payload;

        // Clear any existing manga if (re)starting from page 1
        if (draft.bySourceId[sourceId] != null && page === 1) {
          draft.bySourceId[sourceId].mangaIds = [];
        }

        draft.loadingSourceIds.push(sourceId); // Add loading state
        break;
      }

      case FETCH_CATALOGUE_SUCCESS: {
        const { sourceId, page, mangaIds, hasNextPage } = action.payload;

        const catalogues = draft.bySourceId;

        if (catalogues[sourceId] == null || page === 1) {
          // catalogue is null if there is no data for this catalogue yet
          // (page === 1 && catalogue != null) when restarting the search for this catalogue
          catalogues[sourceId] = {
            page,
            hasNextPage,
            mangaIds
          };
        } else {
          catalogues[sourceId].page = page;
          catalogues[sourceId].hasNextPage = hasNextPage;
          catalogues[sourceId].mangaIds.push(...mangaIds);
        }

        // Remove loading state
        draft.loadingSourceIds = draft.loadingSourceIds.filter(
          id => id !== sourceId
        );

        break;
      }

      case UPDATE_SEARCH_QUERY: {
        const { searchQuery } = action.payload;
        draft.searchQuery = searchQuery;
        break;
      }

      case RESET_CATALOGUE_FOR_SOURCEIDS: {
        // Clean up catalogue data for given sourceId(s)
        const { sourceIds } = action.payload;

        if (Array.isArray(sourceIds)) {
          sourceIds.forEach(sourceId => {
            delete draft.bySourceId[sourceId];
          });
        } else {
          delete draft.bySourceId[sourceIds];
        }

        // Clean up searchQuery
        draft.searchQuery = "";

        // Unsure if I need to clean up loadingSourceIds or not. Skipping for now

        break;
      }

      case RESET_CATALOGUES_TO_INIT: {
        return initialState;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign, consistent-return */
}

// ================================================================================
// Selectors
// ================================================================================

// Using custom loading state handling
export const selectIsCatalogueLoading = (
  state: GlobalState,
  sourceId: string
): boolean => state.catalogues.loadingSourceIds.includes(sourceId);

export const selectCatalogueSearchQuery = (state: GlobalState): string =>
  state.catalogues.searchQuery;

export const selectCatalogueBySourceId = (
  state: GlobalState,
  sourceId: string
): ?CatalogueType => state.catalogues.bySourceId[sourceId];

const emptyArray = []; // caching array to keep selector pure

export const selectCatalogueManga: (
  state: GlobalState,
  sourceId: string
) => $ReadOnlyArray<Manga> = createCachedSelector(
  [
    selectMangaInfos,
    selectCatalogueBySourceId,
    (_, sourceId: string) => sourceId
  ],
  (mangaInfos, catalogue): $ReadOnlyArray<Manga> => {
    if (catalogue == null) return emptyArray;

    return catalogue.mangaIds.map(mangaId => mangaInfos[mangaId]);
  }
)((_, sourceId) => sourceId);

export const selectCatalogueHasNextPage = (
  state: GlobalState,
  sourceId: string
): boolean => {
  const catalogue = selectCatalogueBySourceId(state, sourceId);

  if (catalogue == null) return false;
  return catalogue.hasNextPage;
};
