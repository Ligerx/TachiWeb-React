// @flow
import type { ExtensionType } from "types";

// ================================================================================
// Fetch Preferences
// ================================================================================

// Action Constants and Types
export const FETCH_EXTENSIONS = "extensions/FETCH";

export const FETCH_REQUEST = "extensions/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "extensions/FETCH_REQUEST";

export const FETCH_SUCCESS = "extensions/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "extensions/FETCH_SUCCESS";

export const FETCH_FAILURE = "extensions/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "extensions/FETCH_FAILURE";

// Action Object Types
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

// ================================================================================
// Fetch Preferences
// ================================================================================

// Action Constants and Types
export const INSTALL_EXTENSION = "extensions/INSTALL";

export const INSTALL_REQUEST = "extensions/INSTALL_REQUEST";
type INSTALL_REQUEST_TYPE = "extensions/INSTALL_REQUEST";

export const INSTALL_SUCCESS = "extensions/INSTALL_SUCCESS";
type INSTALL_SUCCESS_TYPE = "extensions/INSTALL_SUCCESS";

export const INSTALL_FAILURE = "extensions/INSTALL_FAILURE";
type INSTALL_FAILURE_TYPE = "extensions/INSTALL_FAILURE";

// Action Object Types
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

// ================================================================================
// Fetch Preferences
// ================================================================================

// Action Constants and Types
export const UNINSTALL_EXTENSION = "extensions/UNINSTALL";

export const UNINSTALL_REQUEST = "extensions/UNINSTALL_REQUEST";
type UNINSTALL_REQUEST_TYPE = "extensions/UNINSTALL_REQUEST";

export const UNINSTALL_SUCCESS = "extensions/UNINSTALL_SUCCESS";
type UNINSTALL_SUCCESS_TYPE = "extensions/UNINSTALL_SUCCESS";

export const UNINSTALL_FAILURE = "extensions/UNINSTALL_FAILURE";
type UNINSTALL_FAILURE_TYPE = "extensions/UNINSTALL_FAILURE";

// Action Object Types
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

// ================================================================================
// Fetch Preferences
// ================================================================================

// Action Constants and Types
export const RELOAD_EXTENSIONS = "extensions/RELOAD";

export const RELOAD_REQUEST = "extensions/RELOAD_REQUEST";
type RELOAD_REQUEST_TYPE = "extensions/RELOAD_REQUEST";

export const RELOAD_SUCCESS = "extensions/RELOAD_SUCCESS";
type RELOAD_SUCCESS_TYPE = "extensions/RELOAD_SUCCESS";

export const RELOAD_FAILURE = "extensions/RELOAD_FAILURE";
type RELOAD_FAILURE_TYPE = "extensions/RELOAD_FAILURE";

// Action Object Types
type ReloadRequestAction = { type: RELOAD_REQUEST_TYPE };

type ReloadSuccessAction = { type: RELOAD_SUCCESS_TYPE };

type ReloadFailureAction = {
  type: RELOAD_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type ExtensionsAction =
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
