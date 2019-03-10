// @flow
import { Server } from "api";
import type { ExtensionType } from "types";
import { handleHTMLError } from "./utils";

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = "extensions/FETCH_REQUEST";
const FETCH_SUCCESS = "extensions/FETCH_SUCCESS";
const FETCH_FAILURE = "extensions/FETCH_FAILURE";
export const FETCH_EXTENSIONS = "extensions/FETCH";

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnlyArray<ExtensionType>;

export default function extensionsReducer(state: State = [], action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.extensions;
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchExtensions() {
  return (dispatch: Function) => {
    dispatch({ type: FETCH_REQUEST });
    return fetch(Server.extensions())
      .then(handleHTMLError)
      .then(
        json => dispatch({ type: FETCH_SUCCESS, extensions: json.data }),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: "Failed to load extensions",
            meta: { error }
          })
      );
  };
}
