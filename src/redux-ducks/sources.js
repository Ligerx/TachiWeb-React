// @flow
import { Server } from "api";
import { isEmpty } from "lodash";
import type { Source } from "@tachiweb/api-client";
import { withDeletedKeys } from "./utils";

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = "sources/FETCH_REQUEST";
const FETCH_SUCCESS = "sources/FETCH_SUCCESS";
const FETCH_FAILURE = "sources/FETCH_FAILURE";
const FETCH_CACHE = "sources/FETCH_CACHE";
export const FETCH_SOURCES = "sources/FETCH";

export const REMOVE_SOURCES = "sources/REMOVE_SOURCES";

// ================================================================================
// Reducers
// ================================================================================
export type SourceMap = { [id: string]: Source };

export default function sourcesReducer(state: SourceMap = {}, action = {}) {
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
// Action Creators
// ================================================================================
export function fetchSources() {
  return (dispatch: Function, getState: Function) => {
    if (!isEmpty(getState().sources))
      return Promise.resolve().then(dispatch({ type: FETCH_CACHE }));

    dispatch({ type: FETCH_REQUEST });

    return Server.api()
      .getSources()
      .then(
        sources => dispatch({ type: FETCH_SUCCESS, payload: sources }),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: "Failed to load sources",
            meta: { error }
          })
      );
  };
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
