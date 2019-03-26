// @flow
import { Server } from "api";
import type { ExtensionType } from "types";
import { RESET_STATE as RESET_CATALOGUE_STATE } from "redux-ducks/catalogue";
import { fetchSources, REMOVE_SOURCES } from "redux-ducks/sources";

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

export const UNINSTALL_EXTENSION = "extensions/UNINSTALL";
const UNINSTALL_REQUEST = `${UNINSTALL_EXTENSION}_REQUEST`;
const UNINSTALL_SUCCESS = `${UNINSTALL_EXTENSION}_SUCCESS`;
const UNINSTALL_FAILURE = `${UNINSTALL_EXTENSION}_FAILURE`;

export const RELOAD_EXTENSIONS = "extensions/RELOAD";
const RELOAD_REQUEST = `${RELOAD_EXTENSIONS}_REQUEST`;
const RELOAD_SUCCESS = `${RELOAD_EXTENSIONS}_SUCCESS`;
const RELOAD_FAILURE = `${RELOAD_EXTENSIONS}_FAILURE`;

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

    case UNINSTALL_SUCCESS:
      return (state.map(extension => {
        if (action.packageName === extension.pkg_name) {
          return { ...extension, status: "AVAILABLE" };
        }
        return extension;
      }): State);

    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchExtensions() {
  return async (dispatch: Function) => {
    dispatch({ type: FETCH_REQUEST });

    try {
      const response = await fetch(Server.extensions());

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      dispatch({ type: FETCH_SUCCESS, extensions: json.data });
    } catch (error) {
      dispatch({
        type: FETCH_FAILURE,
        errorMessage: "Failed to load extensions.",
        meta: { error }
      });
    }
  };
}

// Running install on an already installed extension will update it
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
      dispatch({ type: RESET_CATALOGUE_STATE });
      await fetchSources();
    } catch (error) {
      dispatch({
        type: INSTALL_FAILURE,
        errorMessage: "Failed to install this extension.",
        meta: { error }
      });
    }
  };
}

export function uninstallExtension(extension: ExtensionType) {
  return async (dispatch: Function) => {
    const { pkg_name: packageName, sources } = extension;
    dispatch({ type: UNINSTALL_REQUEST, meta: { packageName } });

    try {
      const response = await fetch(Server.extension(packageName), {
        method: "DELETE"
      });

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      dispatch({ type: UNINSTALL_SUCCESS, packageName });
      dispatch({ type: RESET_CATALOGUE_STATE });
      dispatch({ type: REMOVE_SOURCES, sourceIds: sources });
    } catch (error) {
      dispatch({
        type: UNINSTALL_FAILURE,
        errorMessage: "Failed to uninstall this extension.",
        meta: { error }
      });
    }
  };
}

export function reloadExtensions() {
  return async (dispatch: Function) => {
    dispatch({ type: RELOAD_REQUEST });

    try {
      const response = await fetch(Server.reloadExtensions(), {
        method: "POST"
      });

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      dispatch({ type: RELOAD_SUCCESS });

      // fetch all extensions again because this call does not return the updated data
      await dispatch(fetchExtensions());

      dispatch({ type: RESET_CATALOGUE_STATE });
    } catch (error) {
      dispatch({
        type: RELOAD_FAILURE,
        errorMessage: "Failed to reload extensions.",
        meta: { error }
      });
    }
  };
}
