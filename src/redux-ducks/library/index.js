// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { MangaType, LibraryFlagsType } from "types";
import { selectMangaInfos } from "redux-ducks/mangaInfos";
import { createLoadingSelector } from "redux-ducks/loading";
import { createErrorSelector } from "redux-ducks/error";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import filterSortLibrary from "./libraryUtils";
import {
  FETCH_LIBRARY,
  FETCH_LIBRARY_SUCCESS,
  FETCH_UNREAD,
  FETCH_UNREAD_SUCCESS,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  ADJUST_UNREAD,
  UPLOAD_RESTORE,
  UPLOAD_RESTORE_SUCCESS,
  FETCH_LIBRARY_FLAGS,
  FETCH_LIBRARY_FLAGS_SUCCESS,
  SET_FLAG_REQUEST
} from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  mangaIds: $ReadOnlyArray<number>,
  reloadLibrary: boolean,
  unread: $ReadOnly<{ [mangaId: number]: number }>,
  reloadUnread: boolean,
  flags: LibraryFlagsType,
  isFlagsLoaded: boolean
}>;

const defaultState: State = {
  mangaIds: [], // array of mangaIds that point at data loaded in mangaInfos reducer
  reloadLibrary: true, // Library should be loaded once on first visit
  unread: {}, // { mangaId: int }
  reloadUnread: true, // should refresh unread for library if something new is added
  flags: {
    filters: [
      {
        type: "DOWNLOADED",
        status: "ANY"
      },
      {
        type: "UNREAD",
        status: "ANY"
      },
      {
        type: "COMPLETED",
        status: "ANY"
      }
    ],
    sort: {
      type: "ALPHA",
      direction: "ASCENDING"
    },
    display: "GRID",
    show_download_badges: false
  },
  isFlagsLoaded: false // fetch flags on first load
};

export default function libraryReducer(
  state: State = defaultState,
  action: Action
): State {
  switch (action.type) {
    case FETCH_LIBRARY_SUCCESS:
      return {
        ...state,
        mangaIds: action.mangaIds,
        reloadLibrary: false
      };

    case FETCH_UNREAD_SUCCESS:
      return {
        ...state,
        unread: action.unread,
        reloadUnread: false
      };

    case ADD_TO_FAVORITES:
      return {
        ...state,
        mangaIds: [...state.mangaIds, action.mangaId],
        reloadUnread: true
      };

    case REMOVE_FROM_FAVORITES: {
      const mangaIdToRemove = action.mangaId;
      const newMangaIds: Array<number> = state.mangaIds.filter(
        mangaId => mangaId !== mangaIdToRemove
      );
      return {
        ...state,
        mangaIds: newMangaIds
      };
    }

    case ADJUST_UNREAD: {
      const { unread } = state;
      const { mangaId, difference } = action; // difference should be 1 or -1
      return {
        ...state,
        unread: {
          ...unread,
          [mangaId]: unread[mangaId] + difference
        }
      };
    }

    case UPLOAD_RESTORE_SUCCESS:
      return {
        ...state,
        reloadLibrary: true,
        reloadUnread: true,
        isFlagsLoaded: false
      };

    case FETCH_LIBRARY_FLAGS_SUCCESS:
      return {
        ...state,
        flags: action.flags,
        isFlagsLoaded: true
      };

    case SET_FLAG_REQUEST:
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: action.value
        }
      };

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsRestoreLoading = createLoadingSelector([UPLOAD_RESTORE]);
export const selectDidRestoreFail = createErrorSelector([UPLOAD_RESTORE]);

export const selectIsLibraryLoading = createLoadingSelector([
  FETCH_LIBRARY,
  FETCH_UNREAD,
  FETCH_LIBRARY_FLAGS
]);

export const selectLibraryMangaIds = (
  state: GlobalState
): $ReadOnlyArray<number> => state.library.mangaIds;

export const selectUnread = (
  state: GlobalState
): $ReadOnly<{ [mangaId: number]: number }> => state.library.unread;

export const selectLibraryFlags = (state: GlobalState): LibraryFlagsType =>
  state.library.flags;

export const selectLibraryMangaInfos = createSelector(
  [selectMangaInfos, selectLibraryMangaIds],
  (mangaInfos, mangaIds): Array<MangaType> => {
    return mangaIds.map(mangaId => mangaInfos[mangaId]);
  }
);

// selectFilteredSortedLibrary(state, searchQuery: string)
export const selectFilteredSortedLibrary = createCachedSelector(
  [
    selectLibraryMangaInfos,
    selectLibraryFlags,
    selectUnread,
    (_, searchQuery) => searchQuery
  ],
  filterSortLibrary
  // Cache Key
)((_, searchQuery) => searchQuery);

export const selectShouldReloadLibrary = (state: GlobalState): boolean =>
  state.library.reloadLibrary;

export const selectIsLibraryFlagsLoaded = (state: GlobalState): boolean =>
  state.library.isFlagsLoaded;
