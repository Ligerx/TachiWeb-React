// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { ChapterType } from "types";
import {
  FETCH_SUCCESS,
  FETCH_CACHE,
  UPDATE_SUCCESS,
  UPDATE_READING_STATUS_SUCCESS,
  TOGGLE_READ_SUCCESS
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

export const selectChaptersForManga = (
  state: GlobalState,
  mangaId: number
): Array<ChapterType> => state.chapters[mangaId] || noChapters;

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
