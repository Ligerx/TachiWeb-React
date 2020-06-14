// @flow
import type { SourceMap } from "types";
import type { Source } from "@tachiweb/api-client";
import type { Action } from "redux-ducks/reducers";
import { FETCH_SUCCESS, RESET_SOURCES } from "./actions";

// ================================================================================
// Reducer
// ================================================================================

type State = SourceMap;

const initialState = {};

export default function sourcesReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return sourceArrayToObject(action.payload);

    case RESET_SOURCES:
      return initialState;

    default:
      return state;
  }
}

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
