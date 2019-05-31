// @flow
import { Server } from "api";
import type { ChapterType } from "types";
import createCachedSelector from "re-reselect";
import { ADJUST_UNREAD } from "./library";
import { handleHTMLError } from "./utils";

// ================================================================================
// Actions
// ================================================================================
const FETCH_CACHE = "chapters/FETCH_CACHE";
const FETCH_REQUEST = "chapters/FETCH_REQUEST";
const FETCH_SUCCESS = "chapters/FETCH_SUCCESS";
const FETCH_FAILURE = "chapters/FETCH_FAILURE";
export const FETCH_CHAPTERS = "chapters/FETCH";

const UPDATE_REQUEST = "chapters/UPDATE_REQUEST";
const UPDATE_SUCCESS = "chapters/UPDATE_SUCCESS";
const UPDATE_FAILURE = "chapters/UPDATE_FAILURE";
export const UPDATE_CHAPTERS = "chapters/UPDATE";

const UPDATE_READING_STATUS_NO_CHANGE =
  "chapters/UPDATE_READING_STATUS_NO_CHANGE";
const UPDATE_READING_STATUS_REQUEST = "chapters/UPDATE_READING_STATUS_REQUEST";
const UPDATE_READING_STATUS_SUCCESS = "chapters/UPDATE_READING_STATUS_SUCCESS";
const UPDATE_READING_STATUS_FAILURE = "chapters/UPDATE_READING_STATUS_FAILURE";

const TOGGLE_READ_REQUEST = "chapters/TOGGLE_READ_REQUEST";
const TOGGLE_READ_SUCCESS = "chapters/TOGGLE_READ_SUCCESS";
const TOGGLE_READ_FAILURE = "chapters/TOGGLE_READ_FAILURE";

// ================================================================================
// Reducers
// ================================================================================
type State = { +[mangaId: number]: Array<ChapterType> };

export default function chaptersReducer(state: State = {}, action = {}) {
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

// FIXME: Not sure if including a fallback value causes redux to needlessly rerender.
//        Possible changes?
//        - declare a const noChapters = [] outside this function
//        - just pass down undefined and let the other components handle it
export const selectChaptersForManga = (
  state,
  mangaId: number
): Array<ChapterType> => state.chapters[mangaId] || [];

// example call - selectChapter(state, mangaId, chapterId)
// using re-reselector because I can't find the chapter directly without calling chapters.find()
export const selectChapter = createCachedSelector(
  [selectChaptersForManga, (_, __, chapterId: number) => chapterId],
  (chapters, chapterId) => {
    if (chapters.length === 0) return null;
    return chapters.find(chapter => chapter.id === chapterId);
  }
  // Cache Key
)((state, mangaId, chapterId) => `${mangaId}-${chapterId}`);

// ================================================================================
// Action Creators
// ================================================================================
// Fetch the chapters that are currently cached by the server
type Obj = { ignoreCache?: boolean };
export function fetchChapters(
  mangaId: number,
  { ignoreCache = false }: Obj = {}
) {
  return (dispatch: Function, getState: Function) => {
    // Return manga's cached chapters if they're already in the store
    if (!ignoreCache && getState().chapters[mangaId]) {
      return Promise.resolve().then(dispatch({ type: FETCH_CACHE }));
    }

    dispatch({ type: FETCH_REQUEST, meta: { mangaId } });

    return fetch(Server.chapters(mangaId))
      .then(handleHTMLError)
      .then(
        json =>
          dispatch({ type: FETCH_SUCCESS, payload: json.content, mangaId }),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: "Failed to load chapters",
            meta: { error }
          })
      );
  };
}

// Request the server to re-scrape the source site for chapters
// If there have been any changes, re-fetch the cached chapter list from the server
export function updateChapters(mangaId: number) {
  return (dispatch: Function) => {
    dispatch({ type: UPDATE_REQUEST, meta: { mangaId } });

    return fetch(Server.updateMangaChapters(mangaId))
      .then(handleHTMLError)
      .then(
        json => {
          if (!json.success) {
            return dispatch({
              type: UPDATE_FAILURE,
              errorMessage: "Failed to update the chapters list",
              meta: { json }
            });
          }

          if (json.added.length > 0 || json.removed.length > 0) {
            dispatch({ type: UPDATE_SUCCESS, meta: { json } });
            return dispatch(fetchChapters(mangaId, { ignoreCache: true }));
          }

          return dispatch({
            type: UPDATE_SUCCESS,
            meta: { note: "No updates", json }
          });
        },
        error =>
          dispatch({
            type: UPDATE_FAILURE,
            errorMessage: "Failed to update the chapters list",
            meta: { error }
          })
      );
  };
}

// NOTE: This is only to update one chapter object's read + last_page_read
export function updateReadingStatus(
  mangaId: number,
  chapterId: number,
  readPage: number
) {
  return (dispatch: Function, getState: Function) => {
    // Handle checking if no update needs to happen. Escape early if so.
    const { chapters, pageCounts } = getState();
    const chapter = chapters[mangaId].find(ch => ch.id === chapterId);

    if (!chapter || chapter.read || readPage <= chapter.last_page_read) {
      return dispatch({
        type: UPDATE_READING_STATUS_NO_CHANGE,
        meta: {
          readPage,
          lastPageRead: chapter.last_page_read,
          isRead: chapter.read
        }
      });
    }

    const pageCount = pageCounts[chapter.id];
    const didReadLastPage: ?boolean = readPage === pageCount - 1 ? true : null;

    const updateReadingStatusUrl = Server.updateReadingStatus(
      mangaId,
      chapter.id,
      readPage,
      didReadLastPage
    );

    dispatch({
      type: UPDATE_READING_STATUS_REQUEST,
      meta: { readPage, didReadLastPage }
    });

    return fetch(updateReadingStatusUrl)
      .then(handleHTMLError)
      .then(
        () => {
          if (didReadLastPage) {
            // Update library unread that there's one less unread chapter
            dispatch({ type: ADJUST_UNREAD, mangaId, difference: -1 });
          }

          return dispatch({
            type: UPDATE_READING_STATUS_SUCCESS,
            mangaId,
            chapterId: chapter.id,
            readPage,
            didReadLastPage
          });
        },
        error =>
          dispatch({
            type: UPDATE_READING_STATUS_FAILURE,
            errorMessage: "Failed to save your reading status",
            meta: { error }
          })
      );
  };
}

// TODO: Update this function (and maybe updateReadingStatus()) to new api version
export function toggleRead(mangaId: number, chapterId: number, read: boolean) {
  return (dispatch: Function) => {
    dispatch({ type: TOGGLE_READ_REQUEST, meta: { mangaId, chapterId, read } });

    return fetch(Server.updateReadingStatus(mangaId, chapterId, 0, read))
      .then(handleHTMLError)
      .then(
        () => {
          // Update cached library unread chapter count
          const difference = read ? -1 : 1;
          dispatch({ type: ADJUST_UNREAD, mangaId, difference });

          return dispatch({
            type: TOGGLE_READ_SUCCESS,
            mangaId,
            chapterId,
            read
          });
        },
        error =>
          dispatch({
            type: TOGGLE_READ_FAILURE,
            errorMessage: `Failed to mark chapter as ${
              read ? "read" : "unread"
            }`,
            meta: { error }
          })
      );
  };
}

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

  const newChapter = {
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
