// @flow

// ================================================================================
// Fetch Preferences
// ================================================================================

// Action Constants and Types
export const FETCH_PREFS = "settings/FETCH";

export const FETCH_PREFS_REQUEST = "settings/FETCH_REQUEST";
type FETCH_PREFS_REQUEST_TYPE = "settings/FETCH_REQUEST";

export const FETCH_PREFS_SUCCESS = "settings/FETCH_SUCCESS";
type FETCH_PREFS_SUCCESS_TYPE = "settings/FETCH_SUCCESS";

export const FETCH_PREFS_FAILURE = "settings/FETCH_FAILURE";
type FETCH_PREFS_FAILURE_TYPE = "settings/FETCH_FAILURE";

export const FETCH_PREFS_CACHE = "settings/FETCH_CACHE";
type FETCH_PREFS_CACHE_TYPE = "settings/FETCH_CACHE";

// Action Object Types
export type FetchRequestAction = { type: FETCH_PREFS_REQUEST_TYPE };

export type FetchSuccessAction = {
  type: FETCH_PREFS_SUCCESS_TYPE,
  // data is passed from the server in this format, coerce it into PrefsType
  preferences: Array<{ key: string, value: PrefValue }>
};

export type FetchFailureAction = {
  type: FETCH_PREFS_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

export type FetchCacheAction = { type: FETCH_PREFS_CACHE_TYPE };

// ================================================================================
// Set Preferences
// ================================================================================

// Action Constants and Types
export const SET_PREF_REQUEST = "settings/SET_PREF_REQUEST";
type SET_PREF_REQUEST_TYPE = "settings/SET_PREF_REQUEST";

export const SET_PREF_SUCCESS = "settings/SET_PREF_SUCCESS";
type SET_PREF_SUCCESS_TYPE = "settings/SET_PREF_SUCCESS";

export const SET_PREF_FAILURE = "settings/SET_PREF_FAILURE";
type SET_PREF_FAILURE_TYPE = "settings/SET_PREF_FAILURE";

export const SET_PREF_NO_CHANGE = "settings/SET_PREF_NO_CHANGE";
type SET_PREF_NO_CHANGE_TYPE = "settings/SET_PREF_NO_CHANGE";

// Action Object Types
export type SetPrefRequestAction = {
  type: SET_PREF_REQUEST_TYPE,
  key: string,
  newVal: PrefValue
};

export type SetPrefSuccessAction = { type: SET_PREF_SUCCESS_TYPE };

export type SetPrefFailureAction = {
  type: SET_PREF_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

export type SetPrefNoChangeAction = { type: SET_PREF_NO_CHANGE_TYPE };

// ================================================================================
// Fetch Schema
// ================================================================================

// Action Constants and Types
export const FETCH_SCHEMA = "settings/FETCH_SCHEMA";

export const FETCH_SCHEMA_REQUEST = "settings/FETCH_SCHEMA_REQUEST";
type FETCH_SCHEMA_REQUEST_TYPE = "settings/FETCH_SCHEMA_REQUEST";

export const FETCH_SCHEMA_SUCCESS = "settings/FETCH_SCHEMA_SUCCESS";
type FETCH_SCHEMA_SUCCESS_TYPE = "settings/FETCH_SCHEMA_SUCCESS";

export const FETCH_SCHEMA_FAILURE = "settings/FETCH_SCHEMA_FAILURE";
type FETCH_SCHEMA_FAILURE_TYPE = "settings/FETCH_SCHEMA_FAILURE";

export const FETCH_SCHEMA_CACHE = "settings/FETCH_SCHEMA_CACHE";
type FETCH_SCHEMA_CACHE_TYPE = "settings/FETCH_SCHEMA_CACHE";

// Action Object Types
export type FetchSchemaRequestAction = { type: FETCH_SCHEMA_REQUEST_TYPE };

export type FetchSchemaSuccessAction = {
  type: FETCH_SCHEMA_SUCCESS_TYPE,
  schema: SchemaType
};

export type FetchSchemaFailureAction = {
  type: FETCH_SCHEMA_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

export type FetchSchemaCacheAction = { type: FETCH_SCHEMA_CACHE_TYPE };

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type SettingsAction =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | FetchCacheAction
  | SetPrefRequestAction
  | SetPrefSuccessAction
  | SetPrefFailureAction
  | SetPrefNoChangeAction
  | FetchSchemaRequestAction
  | FetchSchemaSuccessAction
  | FetchSchemaFailureAction
  | FetchSchemaCacheAction;
