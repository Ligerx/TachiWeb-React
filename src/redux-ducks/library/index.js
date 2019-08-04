// @flow
import type { Manga } from "@tachiweb/api-client";
import type { LibraryFlagsType } from "types";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { selectMangaInfos } from "redux-ducks/mangaInfos";
import { createLoadingSelector } from "redux-ducks/loading";
import { createErrorSelector } from "redux-ducks/error";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import {
  UPDATE_SUCCESS as UPDATE_CHAPTERS_SUCCESS,
  UPDATE_READING_STATUS_SUCCESS
} from "redux-ducks/chapters/actions";
import { selectSources } from "redux-ducks/sources";
import { selectCategoryMangaIds } from "redux-ducks/categories";
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
  downloaded: $ReadOnly<{ [mangaId: number]: number }>,
  totalChaptersSortIndexes: $ReadOnly<{ [index: number]: number }>,
  lastReadSortIndexes: $ReadOnly<{ [index: number]: number }>,
  reloadUnread: boolean,
  reloadTotalChaptersSortIndexes: boolean,
  reloadLastReadSortIndexes: boolean,
  flags: LibraryFlagsType,
  isFlagsLoaded: boolean
}>;

const defaultState: State = {
  mangaIds: [], // array of mangaIds that point at data loaded in mangaInfos reducer
  reloadLibrary: true, // Library should be loaded once on first visit
  unread: {},
  downloaded: {},
  totalChaptersSortIndexes: {},
  lastReadSortIndexes: {},
  reloadUnread: true, // should refresh unread for library if something new is added
  reloadDownloaded: true,
  reloadTotalChaptersSortIndexes: true,
  reloadLastReadSortIndexes: true,
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
        reloadUnread: true,
        reloadDownloaded: true,
        reloadTotalChaptersSortIndexes: true,
        reloadLastReadSortIndexes: true
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
        isFlagsLoaded: false,
        reloadDownloaded: true,
        reloadTotalChaptersSortIndexes: true,
        reloadLastReadSortIndexes: true
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

    case UPDATE_CHAPTERS_SUCCESS:
      return {
        ...state,
        reloadUnread: true,
        reloadTotalChaptersSortIndexes: true
      };

    case UPDATE_READING_STATUS_SUCCESS:
      return {
        ...state,
        reloadLastReadSortIndexes: true
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

// [June 22, 2019] Was running into some circular dependency problems with library and
// category selectors. Using functions instead of arrow functions seems to solve the problem...
// https://github.com/reduxjs/reselect/issues/169#issuecomment-274690285
export function selectLibraryMangaIds(
  state: GlobalState
): $ReadOnlyArray<number> {
  return state.library.mangaIds;
}

export const selectUnread = (
  state: GlobalState
): $ReadOnly<{ [mangaId: number]: number }> => state.library.unread;

export const selectLibraryFlags = (state: GlobalState): LibraryFlagsType =>
  state.library.flags;

export const selectLibraryMangaInfos: GlobalState => $ReadOnlyArray<Manga> = createSelector(
  [selectMangaInfos, selectLibraryMangaIds],
  (mangaInfos, mangaIds): $ReadOnlyArray<Manga> => {
    return mangaIds.map(mangaId => mangaInfos[mangaId]);
  }
);

export const selectLibraryMangaInfosForCurrentCategory: GlobalState => $ReadOnlyArray<Manga> = createSelector(
  [selectMangaInfos, selectCategoryMangaIds, selectLibraryMangaIds],
  (mangaInfos, categoryMangaIds, libraryMangaIds): $ReadOnlyArray<Manga> => {
    // Categories don't delete unfavorited mangas, so there may be category mangaIds that don't exist
    // in library. So compare category and library mangaIds before pulling from mangaInfos.
    const categoryMangaIdsInLibrary = categoryMangaIds.filter(categoryMangaId =>
      libraryMangaIds.includes(categoryMangaId)
    );
    return categoryMangaIdsInLibrary.map(mangaId => mangaInfos[mangaId]);
  }
);

export const selectFilteredSortedLibrary: (
  state: GlobalState,
  searchQuery: string
) => $ReadOnlyArray<Manga> = createCachedSelector(
  [
    selectLibraryMangaInfosForCurrentCategory,
    selectLibraryFlags,
    selectSources,
    selectUnread,
    // [June 16, 2019] Too lazy to make individual selectors for each of these right now.
    (state: GlobalState) => state.library.downloaded,
    (state: GlobalState) => state.library.totalChaptersSortIndexes,
    (state: GlobalState) => state.library.lastReadSortIndexes,
    // ------
    (_, searchQuery) => searchQuery
  ],
  filterSortLibrary
  // Cache Key
)((_, searchQuery) => searchQuery);

export const selectShouldReloadLibrary = (state: GlobalState): boolean =>
  state.library.reloadLibrary;

export const selectIsLibraryFlagsLoaded = (state: GlobalState): boolean =>
  state.library.isFlagsLoaded;
