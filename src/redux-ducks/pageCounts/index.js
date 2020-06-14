// @flow
import type { Action } from "redux-ducks/reducers";
import type { PageCounts } from "types";
import { FETCH_SUCCESS, FETCH_CACHE } from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = PageCounts;

export default function pageCountsReducer(
  state: State = {},
  action: Action
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
