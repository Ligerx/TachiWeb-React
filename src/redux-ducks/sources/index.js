// @flow
import { createLoadingSelector } from "redux-ducks/loading";
import type { SourceType } from "types";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { FETCH_SOURCES, FETCH_SUCCESS } from "./actions";

// ================================================================================
// Reducer
// ================================================================================

type State = $ReadOnlyArray<SourceType>;

export default function sourcesReducer(
  state: State = [],
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsSourcesLoading = createLoadingSelector([FETCH_SOURCES]);
export const selectSources = (state: GlobalState): $ReadOnlyArray<SourceType> =>
  state.sources;
