// @flow
import { createLoadingSelector } from "redux-ducks/loading";
import type { SourceMap } from "types";
import type { Source } from "@tachiweb/api-client";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { withDeletedKeys } from "redux-ducks/utils";
import { FETCH_SOURCES, FETCH_SUCCESS, REMOVE_SOURCES } from "./actions";

// ================================================================================
// Reducer
// ================================================================================

type State = SourceMap;

export default function sourcesReducer(
  state: State = {},
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return sourceArrayToObject(action.payload);

    case REMOVE_SOURCES:
      return withDeletedKeys<string, Source>(state, action.sourceIds);

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsSourcesLoading = createLoadingSelector([FETCH_SOURCES]);
export const selectSources = (state: GlobalState): State => state.sources;

// ================================================================================
// Helper Functions
// ================================================================================
function sourceArrayToObject(sourceArray: Array<Source>): SourceMap {
  const sourceObject = {};
  sourceArray.forEach(source => {
    sourceObject[source.id] = source;
  });
  return sourceObject;
}
