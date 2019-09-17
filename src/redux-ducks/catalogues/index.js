// @flow
import produce from "immer";
import createCachedSelector from "re-reselect";
import type { Manga } from "@tachiweb/api-client";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { selectMangaInfos } from "redux-ducks/mangaInfos";
import {
  RESET_CATALOGUE,
  FETCH_CATALOGUE_SUCCESS,
  UPDATE_SEARCH_QUERY
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
  /* eslint-disable no-param-reassign */
  return produce(state, draft => {
    switch (action.type) {
      case FETCH_CATALOGUE_SUCCESS: {
        const { sourceId, page, mangaIds, hasNextPage } = action.payload;

        const catalogues = draft.bySourceId;

        if (catalogues[sourceId] == null) {
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

        break;
      }

      case UPDATE_SEARCH_QUERY: {
        const { searchQuery } = action.payload;
        draft.searchQuery = searchQuery;
        break;
      }

      case RESET_CATALOGUE: {
        const { sourceId } = action.payload;
        delete draft.bySourceId[sourceId];
        break;
      }

      default:
        break;
    }
  });
  /* eslint-enable no-param-reassign */
}

// ================================================================================
// Selectors
// ================================================================================

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
  [selectMangaInfos, selectCatalogueBySourceId, (_, sourceId) => sourceId],
  (mangaInfos, catalogue): $ReadOnlyArray<Manga> => {
    if (catalogue == null) return emptyArray;

    return catalogue.mangaIds.map(mangaId => mangaInfos[mangaId]);
  }
)((_, __, sourceId) => sourceId);

export const selectCatalogueHasNextPage = (
  state: GlobalState,
  sourceId: string
): boolean => {
  const catalogue = selectCatalogueBySourceId(state, sourceId);

  if (catalogue == null) return false;
  return catalogue.hasNextPage;
};
