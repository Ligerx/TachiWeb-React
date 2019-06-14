// @flow
import { Server } from "api";
import { handleHTMLError } from "redux-ducks/utils";
import type { GlobalState, AnyAction, ThunkAction } from "redux-ducks/reducers";

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = "pageCounts/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "pageCounts/FETCH_REQUEST";
const FETCH_SUCCESS = "pageCounts/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "pageCounts/FETCH_SUCCESS";
const FETCH_FAILURE = "pageCounts/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "pageCounts/FETCH_FAILURE";
const FETCH_CACHE = "pageCounts/FETCH_CACHE";
type FETCH_CACHE_TYPE = "pageCounts/FETCH_CACHE";

type FetchRequestAction = { type: FETCH_REQUEST_TYPE };
type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  chapterId: number,
  pageCount: number
};
type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type FetchCacheAction = { type: FETCH_CACHE_TYPE };

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnly<{ [chapterId: number]: number }>;
export type Action =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | FetchCacheAction;

export default function pageCountsReducer(
  state: State = {},
  action: AnyAction
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        [action.chapterId]: action.pageCount
      };
    case FETCH_CACHE:
      return state;
    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectPageCounts = (state: GlobalState): State => state.pageCounts;

export const selectPageCount = (
  state: GlobalState,
  chapterId: number
): ?number => state.pageCounts[chapterId];

// ================================================================================
// Action Creators
// ================================================================================
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
