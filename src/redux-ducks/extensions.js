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

const INSTALL_REQUEST = "extensions/INSTALL_REQUEST";
const INSTALL_SUCCESS = "extensions/INSTALL_SUCCESS";
const INSTALL_FAILURE = "extensions/INSTALL_FAILURE";
export const INSTALL_EXTENSION = "extensions/INSTALL";

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnlyArray<ExtensionType>;

export default function extensionsReducer(state: State = [], action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.extensions;

    case INSTALL_SUCCESS: {
      const updatedExtension: ExtensionType = action.extension;

      return (state.map(extension => {
        // Replace the non-installed extension data with updated extension
        if (updatedExtension.pkg_name === extension.pkg_name) {
          return action.extension;
        }
        return extension;
      }): State);
    }

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

export function installExtension(packageName: string) {
  return async (dispatch: Function) => {
    dispatch({ type: INSTALL_REQUEST, meta: { packageName } });

    try {
      const response = await fetch(Server.installExtension(packageName), {
        method: "POST"
      });

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      const extension: ExtensionType = json.data[0];

      dispatch({ type: INSTALL_SUCCESS, extension });
    } catch (error) {
      dispatch({
        type: INSTALL_FAILURE,
        errorMessage: "Failed to install this extension.",
        meta: { error }
      });
    }
  };
}
