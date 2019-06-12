// @flow
import { Server } from "api";
import type { GlobalState } from "redux-ducks/reducers";
import type { ExtensionType } from "types";
import { RESET_STATE as RESET_CATALOGUE_STATE } from "redux-ducks/catalogue";
import { createLoadingSelector } from "redux-ducks/loading";
import { createSelector } from "reselect";

// ================================================================================
// Actions
// ================================================================================
const FETCH_EXTENSIONS = "extensions/FETCH";
const FETCH_REQUEST = "extensions/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "extensions/FETCH_REQUEST";
const FETCH_SUCCESS = "extensions/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "extensions/FETCH_SUCCESS";
const FETCH_FAILURE = "extensions/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "extensions/FETCH_FAILURE";

type FetchRequestAction = { type: FETCH_REQUEST_TYPE };
type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  extensions: Array<ExtensionType>
};
type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

const INSTALL_EXTENSION = "extensions/INSTALL";
const INSTALL_REQUEST = "extensions/INSTALL_REQUEST";
type INSTALL_REQUEST_TYPE = "extensions/INSTALL_REQUEST";
const INSTALL_SUCCESS = "extensions/INSTALL_SUCCESS";
type INSTALL_SUCCESS_TYPE = "extensions/INSTALL_SUCCESS";
const INSTALL_FAILURE = "extensions/INSTALL_FAILURE";
type INSTALL_FAILURE_TYPE = "extensions/INSTALL_FAILURE";

type InstallRequestAction = { type: INSTALL_REQUEST_TYPE, meta: Object };
type InstallSuccessAction = {
  type: INSTALL_SUCCESS_TYPE,
  extension: ExtensionType
};
type InstallFailureAction = {
  type: INSTALL_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

const UNINSTALL_EXTENSION = "extensions/UNINSTALL";
const UNINSTALL_REQUEST = "extensions/UNINSTALL_REQUEST";
type UNINSTALL_REQUEST_TYPE = "extensions/UNINSTALL_REQUEST";
const UNINSTALL_SUCCESS = "extensions/UNINSTALL_SUCCESS";
type UNINSTALL_SUCCESS_TYPE = "extensions/UNINSTALL_SUCCESS";
const UNINSTALL_FAILURE = "extensions/UNINSTALL_FAILURE";
type UNINSTALL_FAILURE_TYPE = "extensions/UNINSTALL_FAILURE";

type UninstallRequestAction = { type: UNINSTALL_REQUEST_TYPE, meta: Object };
type UninstallSuccessAction = {
  type: UNINSTALL_SUCCESS_TYPE,
  packageName: string
};
type UninstallFailureAction = {
  type: UNINSTALL_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

const RELOAD_EXTENSIONS = "extensions/RELOAD";
const RELOAD_REQUEST = "extensions/RELOAD_REQUEST";
type RELOAD_REQUEST_TYPE = "extensions/RELOAD_REQUEST";
const RELOAD_SUCCESS = "extensions/RELOAD_SUCCESS";
type RELOAD_SUCCESS_TYPE = "extensions/RELOAD_SUCCESS";
const RELOAD_FAILURE = "extensions/RELOAD_FAILURE";
type RELOAD_FAILURE_TYPE = "extensions/RELOAD_FAILURE";

type ReloadRequestAction = { type: RELOAD_REQUEST_TYPE };
type ReloadSuccessAction = { type: RELOAD_SUCCESS_TYPE };
type ReloadFailureAction = {
  type: RELOAD_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnlyArray<ExtensionType>;
type Action =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | InstallRequestAction
  | InstallSuccessAction
  | InstallFailureAction
  | UninstallRequestAction
  | UninstallSuccessAction
  | UninstallFailureAction
  | ReloadRequestAction
  | ReloadSuccessAction
  | ReloadFailureAction;

export default function extensionsReducer(
  state: State = [],
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.extensions;

    case INSTALL_SUCCESS: {
      const updatedExtension: ExtensionType = action.extension;

      return (state.map(extension => {
        // Replace the non-installed extension data with updated extension
        if (updatedExtension.pkg_name === extension.pkg_name) {
          return updatedExtension;
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
// Selectors
// ================================================================================

export const selectIsExtensionsLoading = createLoadingSelector([
  FETCH_EXTENSIONS,
  INSTALL_EXTENSION,
  UNINSTALL_EXTENSION,
  RELOAD_EXTENSIONS
]);

export const selectExtensions = (
  state: GlobalState
): $ReadOnlyArray<ExtensionType> => state.extensions;

export const selectInstalledExtensions = createSelector(
  [selectExtensions],
  extensions => {
    return extensions
      .filter(extension => extension.status === "INSTALLED")
      .sort(extensionSort);
  }
);

export const selectNotInstalledExtensions = createSelector(
  [selectExtensions],
  extensions => {
    return extensions
      .filter(extension => extension.status !== "INSTALLED")
      .sort(extensionSort);
  }
);

// ================================================================================
// Action Creators
// ================================================================================
type GetState = () => GlobalState;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
// eslint-disable-next-line no-use-before-define
type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

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
    } catch (error) {
      dispatch({
        type: INSTALL_FAILURE,
        errorMessage: "Failed to install this extension.",
        meta: { error }
      });
    }
  };
}

export function uninstallExtension(packageName: string): ThunkAction {
  return async dispatch => {
    dispatch({ type: UNINSTALL_REQUEST, meta: { packageName } });

    try {
      const response = await fetch(Server.extension(packageName), {
        method: "DELETE"
      });

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      dispatch({ type: UNINSTALL_SUCCESS, packageName });
      dispatch({ type: RESET_CATALOGUE_STATE });
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

// ================================================================================
// Helper Functions
// ================================================================================

function extensionSort(a: ExtensionType, b: ExtensionType) {
  // First sort alphabetically by language
  // Not using the pretty print / native name, but it gets the job done
  if (a.lang > b.lang) return 1;
  if (a.lang < b.lang) return -1;

  // Then sort alphabetically by source name
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;

  return 0;
}
