// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import { FETCH_SUCCESS, FETCH_CACHE } from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnlyArray<{
  id: number,
  manga: $ReadOnlyArray<number>,
  name: string,
  order: number
}>;

export default function categoriesReducer(
  state: State = [],
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:

    case FETCH_CACHE:

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================
