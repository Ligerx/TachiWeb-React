// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import { ADJUST_UNREAD } from "redux-ducks/library/actions";
import { handleHTMLError } from "redux-ducks/utils";
import { selectPageCount } from "redux-ducks/pageCounts";
import { selectChaptersForManga, selectChapter } from ".";
import {
  FETCH_CACHE,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  UPDATE_REQUEST,
  UPDATE_FAILURE,
  UPDATE_SUCCESS,
  UPDATE_READING_STATUS_FAILURE,
  UPDATE_READING_STATUS_NO_CHANGE,
  UPDATE_READING_STATUS_REQUEST,
  UPDATE_READING_STATUS_SUCCESS,
  TOGGLE_READ_REQUEST,
  TOGGLE_READ_SUCCESS,
  TOGGLE_READ_FAILURE
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
// Fetch the chapters that are currently cached by the server
type Obj = { ignoreCache?: boolean };
export function fetchChapters(
  mangaId: number,
  { ignoreCache = false }: Obj = {}
): ThunkAction {
  return (dispatch, getState) => {
    // Return manga's cached chapters if they're already in the store
    if (
      !ignoreCache &&
      selectChaptersForManga(getState(), mangaId).length > 0
    ) {
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
export function updateChapters(mangaId: number): ThunkAction {
  return dispatch => {
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
): ThunkAction {
  return (dispatch, getState) => {
    // Handle checking if no update needs to happen. Escape early if so.
    const chapter = selectChapter(getState(), mangaId, chapterId);
    const pageCount = selectPageCount(getState(), chapterId);

    if (pageCount == null) {
      return dispatch({
        type: UPDATE_READING_STATUS_FAILURE,
        errorMessage: "Couldn't find page count for this chapter.",
        meta: { mangaId, chapterId, readPage }
      });
    }

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

    const didReadLastPage: boolean = readPage === pageCount - 1;

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
export function toggleRead(
  mangaId: number,
  chapterId: number,
  read: boolean
): ThunkAction {
  return dispatch => {
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
