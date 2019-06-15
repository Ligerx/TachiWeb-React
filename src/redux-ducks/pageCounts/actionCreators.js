// @flow
import { Server } from "api";
import { handleHTMLError } from "redux-ducks/utils";
import type { ThunkAction } from "redux-ducks/reducers";
import { selectPageCount } from ".";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CACHE
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
// eslint-disable-next-line import/prefer-default-export
export function fetchPageCount(
  mangaId: number,
  chapterId: number
): ThunkAction {
  return (dispatch, getState) => {
    // Return manga's chapters' cached pageCount data if they're already in the store
    if (selectPageCount(getState(), chapterId)) {
      return dispatch({ type: FETCH_CACHE });
    }

    dispatch({ type: FETCH_REQUEST });

    return fetch(Server.pageCount(mangaId, chapterId))
      .then(handleHTMLError)
      .then(
        json =>
          dispatch({
            type: FETCH_SUCCESS,
            chapterId,
            pageCount: json.page_count
          }),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: "Failed to get page count",
            meta: { error }
          })
      );
  };
}
