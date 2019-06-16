// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import type { ExtensionType } from "types";
import { REMOVE_SOURCES } from "redux-ducks/sources/actions";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import { RESET_STATE as RESET_CATALOGUE_STATE } from "redux-ducks/catalogue/actions";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  INSTALL_REQUEST,
  INSTALL_SUCCESS,
  INSTALL_FAILURE,
  UNINSTALL_REQUEST,
  UNINSTALL_SUCCESS,
  UNINSTALL_FAILURE,
  RELOAD_REQUEST,
  RELOAD_SUCCESS,
  RELOAD_FAILURE
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
export function fetchExtensions(): ThunkAction {
  return async dispatch => {
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
export function installExtension(packageName: string): ThunkAction {
  return async dispatch => {
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

      // When a new extension is installed, new sources are added and we
      // don't know what those sources are so we have to fetch them.
      await dispatch(fetchSources());
    } catch (error) {
      dispatch({
        type: INSTALL_FAILURE,
        errorMessage: "Failed to install this extension.",
        meta: { error }
      });
    }
  };
}

export function uninstallExtension(extension: ExtensionType): ThunkAction {
  return async dispatch => {
    dispatch({ type: UNINSTALL_REQUEST, meta: { extension } });

    try {
      const { pkg_name: packageName, sources } = extension;

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

export function reloadExtensions(): ThunkAction {
  return async dispatch => {
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
