// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { ChapterType } from "types";
import type { Manga } from "@tachiweb/api-client";
import createCachedSelector from "re-reselect";
import { createLoadingSelector } from "redux-ducks/loading";
import { selectMangaInfo } from "redux-ducks/mangaInfos";
import filterSortChapters from "./chapterUtils";
import {
  FETCH_SUCCESS,
  FETCH_CACHE,
  UPDATE_SUCCESS,
  UPDATE_READING_STATUS_SUCCESS,
  TOGGLE_READ_SUCCESS,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS
} from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{ [mangaId: number]: Array<ChapterType> }>;

export default function chaptersReducer(
  state: State = {},
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        [action.mangaId]: action.payload
      };

    case FETCH_CACHE:
      return state;

    case UPDATE_SUCCESS:
      return state; // doesn't directly edit state, calls fetchChapters

    case UPDATE_READING_STATUS_SUCCESS: {
      const { mangaId, chapterId, readPage, didReadLastPage } = action;
      return {
        ...state,
        [mangaId]: changeChapterObjReadState(
          state[mangaId],
          chapterId,
          didReadLastPage,
          readPage
        )
      };
    }

    case TOGGLE_READ_SUCCESS: {
      const { mangaId, chapterId, read } = action;
      return {
        ...state,
        [mangaId]: changeChapterObjReadState(state[mangaId], chapterId, read)
      };
    }

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

const noChapters = []; // selector memoization optimization

export const selectIsChaptersLoading = createLoadingSelector([
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS
]);

export const selectChaptersForManga = (
  state: GlobalState,
  mangaId: number
): Array<ChapterType> => state.chapters[mangaId] || noChapters;

// Example call - selectChapter(state, mangaId, chapterId)
// Using re-reselector because of the way chapters are stored as arrays inside a map
// You can't find the chapter directly without calling chapters.find()
export const selectChapter = createCachedSelector(
  [selectChaptersForManga, (_, __, chapterId: number) => chapterId],
  (chapters, chapterId): ?ChapterType =>
    chapters.find(chapter => chapter.id === chapterId)
  // Cache Key
)((state, mangaId, chapterId) => `${mangaId}-${chapterId}`);

// selectFilteredSortedChapters(state, mangaId)
export const selectFilteredSortedChapters = createCachedSelector(
  [selectMangaInfo, selectChaptersForManga],
  (mangaInfo: ?Manga, chapters: Array<ChapterType>) => {
    if (!mangaInfo) return noChapters;
    return filterSortChapters(chapters, mangaInfo.flags);
  }
)((_, mangaId) => mangaId);

// selectFirstUnreadChapter(state, mangaId)
export const selectFirstUnreadChapter = createCachedSelector(
  [selectChaptersForManga],
  chapters => {
    // Currently just relying on the default sort order
    let firstUnreadChapter = null;

    // using Array.some() for a short-circuit-able iterator
    chapters.some(chapter => {
      if (!chapter.read) {
        firstUnreadChapter = chapter;
        return true; // escape
      }
      return false; // continue
    });

    return firstUnreadChapter;
  }
  // Cache Key
)((_, mangaId) => mangaId);

// selectNextChapterId(state, mangaId, thisChapterId)
export const selectNextChapterId = createCachedSelector(
  [selectChaptersForManga, (_, __, thisChapterId: number) => thisChapterId],
  (chapters, thisChapterId): ?number => {
    const thisChapterIndex = chapters.findIndex(
      chapter => chapter.id === thisChapterId
    );

    if (thisChapterIndex === chapters.length - 1 || thisChapterIndex === -1) {
      return null;
    }
    return chapters[thisChapterIndex + 1].id;
  }
  // Cache Key
)((state, mangaId, thisChapterId) => `${mangaId}-${thisChapterId}`);

// selectPrevChapterId(state, mangaId, thisChapterId)
export const selectPrevChapterId = createCachedSelector(
  [selectChaptersForManga, (_, __, thisChapterId: number) => thisChapterId],
  (chapters, thisChapterId): ?number => {
    const thisChapterIndex = chapters.findIndex(
      chapter => chapter.id === thisChapterId
    );

    if (thisChapterIndex === 0 || thisChapterIndex === -1) {
      return null;
    }
    return chapters[thisChapterIndex - 1].id;
  }
  // Cache Key
)((state, mangaId, thisChapterId) => `${mangaId}-${thisChapterId}`);

// ================================================================================
// Helper Functions
// ================================================================================
function changeChapterObjReadState(
  chapters,
  chapterId,
  didReadLastPage,
  readPage = 0
) {
  const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
  const chapter = chapters[chapterIndex];

  const newChapter: ChapterType = {
    ...chapter,
    last_page_read: readPage,
    read: didReadLastPage
  };

  return [
    ...chapters.slice(0, chapterIndex),
    newChapter,
    ...chapters.slice(chapterIndex + 1)
  ];
}
