// @flow
import { Server } from "api";
import type { ExtensionType } from "types";
import { handleHTMLError } from "./utils";

// ================================================================================
// Actions
// ================================================================================
export const FETCH_EXTENSIONS = "extensions/FETCH";
const FETCH_REQUEST = `${FETCH_EXTENSIONS}_REQUEST`;
const FETCH_SUCCESS = `${FETCH_EXTENSIONS}_SUCCESS`;
const FETCH_FAILURE = `${FETCH_EXTENSIONS}_FAILURE`;

export const INSTALL_EXTENSION = "extensions/INSTALL";
const INSTALL_REQUEST = `${INSTALL_EXTENSION}_REQUEST`;
const INSTALL_SUCCESS = `${INSTALL_EXTENSION}_SUCCESS`;
const INSTALL_FAILURE = `${INSTALL_EXTENSION}_FAILURE`;

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
