// @flow
import type { LibraryFlagsType } from "types";
import type { GlobalState, Action } from "redux-ducks/reducers";
import {
  UPDATE_SUCCESS as UPDATE_CHAPTERS_SUCCESS,
  UPDATE_READING_STATUS_SUCCESS
} from "redux-ducks/chapters/actions";
import {
  FETCH_LIBRARY_SUCCESS,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  UPLOAD_RESTORE_SUCCESS,
  FETCH_LIBRARY_FLAGS_SUCCESS,
  SET_FLAG_REQUEST
} from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  mangaIds: $ReadOnlyArray<number>,
  reloadLibrary: boolean,
  downloaded: $ReadOnly<{ [mangaId: number]: number }>,
  totalChaptersSortIndexes: $ReadOnly<{ [index: number]: number }>,
  lastReadSortIndexes: $ReadOnly<{ [index: number]: number }>,
  reloadTotalChaptersSortIndexes: boolean,
  reloadLastReadSortIndexes: boolean,
  flags: LibraryFlagsType,
  isFlagsLoaded: boolean
}>;

const defaultState: State = {
  mangaIds: [], // array of mangaIds that point at data loaded in mangaInfos reducer
  reloadLibrary: true, // Library should be loaded once on first visit
  downloaded: {},
  totalChaptersSortIndexes: {},
  lastReadSortIndexes: {},
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

    case ADD_TO_FAVORITES:
      return {
        ...state,
        mangaIds: [...state.mangaIds, action.mangaId],
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

    case UPLOAD_RESTORE_SUCCESS:
      return {
        ...state,
        reloadLibrary: true,
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

// [June 22, 2019] Was running into some circular dependency problems with library and
// category selectors. Using functions instead of arrow functions seems to solve the problem...
// https://github.com/reduxjs/reselect/issues/169#issuecomment-274690285
export function selectLibraryMangaIds(
  state: GlobalState
): $ReadOnlyArray<number> {
  return state.library.mangaIds;
}

export const selectShouldReloadLibrary = (state: GlobalState): boolean =>
  state.library.reloadLibrary;
