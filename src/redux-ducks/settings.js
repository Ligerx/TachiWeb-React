// @flow
import { Server } from "api";
import type { SchemaType } from "types/settings-schema";
import UI_SETTINGS from "ui-settings";
import { createLoadingSelector } from "redux-ducks/loading";
import type { GlobalState } from "redux-ducks/reducers";

export type PrefValue = string | Array<string> | number | boolean | null | void;
export type PrefsType = $ReadOnly<{ [key: string]: PrefValue }>;

// ================================================================================
// Actions
// ================================================================================
const FETCH_PREFS = "settings/FETCH";
const FETCH_PREFS_REQUEST = "settings/FETCH_REQUEST";
type FETCH_PREFS_REQUEST_TYPE = "settings/FETCH_REQUEST";
const FETCH_PREFS_SUCCESS = "settings/FETCH_SUCCESS";
type FETCH_PREFS_SUCCESS_TYPE = "settings/FETCH_SUCCESS";
const FETCH_PREFS_FAILURE = "settings/FETCH_FAILURE";
type FETCH_PREFS_FAILURE_TYPE = "settings/FETCH_FAILURE";
const FETCH_PREFS_CACHE = "settings/FETCH_CACHE";
type FETCH_PREFS_CACHE_TYPE = "settings/FETCH_CACHE";

type FetchRequestAction = { type: FETCH_PREFS_REQUEST_TYPE };
type FetchSuccessAction = {
  type: FETCH_PREFS_SUCCESS_TYPE,
  // data is passed from the server in this format, coerce it into PrefsType
  preferences: Array<{ key: string, value: PrefValue }>
};
type FetchFailureAction = {
  type: FETCH_PREFS_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type FetchCacheAction = { type: FETCH_PREFS_CACHE_TYPE };

const SET_PREF_REQUEST = "settings/SET_PREF_REQUEST";
type SET_PREF_REQUEST_TYPE = "settings/SET_PREF_REQUEST";
const SET_PREF_SUCCESS = "settings/SET_PREF_SUCCESS";
type SET_PREF_SUCCESS_TYPE = "settings/SET_PREF_SUCCESS";
const SET_PREF_FAILURE = "settings/SET_PREF_FAILURE";
type SET_PREF_FAILURE_TYPE = "settings/SET_PREF_FAILURE";
const SET_PREF_NO_CHANGE = "settings/SET_PREF_NO_CHANGE";
type SET_PREF_NO_CHANGE_TYPE = "settings/SET_PREF_NO_CHANGE";

type SetPrefRequestAction = {
  type: SET_PREF_REQUEST_TYPE,
  key: string,
  newVal: PrefValue
};
type SetPrefSuccessAction = { type: SET_PREF_SUCCESS_TYPE };
type SetPrefFailureAction = {
  type: SET_PREF_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type SetPrefNoChangeAction = { type: SET_PREF_NO_CHANGE_TYPE };

const FETCH_SCHEMA = "settings/FETCH_SCHEMA";
const FETCH_SCHEMA_REQUEST = "settings/FETCH_SCHEMA_REQUEST";
type FETCH_SCHEMA_REQUEST_TYPE = "settings/FETCH_SCHEMA_REQUEST";
const FETCH_SCHEMA_SUCCESS = "settings/FETCH_SCHEMA_SUCCESS";
type FETCH_SCHEMA_SUCCESS_TYPE = "settings/FETCH_SCHEMA_SUCCESS";
const FETCH_SCHEMA_FAILURE = "settings/FETCH_SCHEMA_FAILURE";
type FETCH_SCHEMA_FAILURE_TYPE = "settings/FETCH_SCHEMA_FAILURE";
const FETCH_SCHEMA_CACHE = "settings/FETCH_SCHEMA_CACHE";
type FETCH_SCHEMA_CACHE_TYPE = "settings/FETCH_SCHEMA_CACHE";

type FetchSchemaRequestAction = { type: FETCH_SCHEMA_REQUEST_TYPE };
type FetchSchemaSuccessAction = {
  type: FETCH_SCHEMA_SUCCESS_TYPE,
  schema: SchemaType
};
type FetchSchemaFailureAction = {
  type: FETCH_SCHEMA_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};
type FetchSchemaCacheAction = { type: FETCH_SCHEMA_CACHE_TYPE };

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnly<{
  schema: ?SchemaType,
  prefs: PrefsType,
  allPrefsFetched: boolean // Whether or not all preferences have been fetched, required as prefs can be fetch individually
}>;

type Action =
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

export default function settingsReducers(
  state: State = {
    schema: null,
    prefs: {},
    allPrefsFetched: false
  },
  action: Action
): State {
  switch (action.type) {
    case FETCH_PREFS_SUCCESS:
      return {
        ...state,
        // Transform preferences from array format to map format
        prefs: action.preferences.reduce(
          (obj, pref) => ({
            ...obj,
            [pref.key]: pref.value
          }),
          {}
        ),
        allPrefsFetched: true
      };

    case SET_PREF_REQUEST:
      // Preference changes take effect immediately on the client
      return {
        ...state,
        prefs: {
          ...state.prefs,
          [action.key]: action.newVal
        }
      };

    case FETCH_SCHEMA_SUCCESS:
      return {
        ...state,
        // Merge remote schema with embedded schema
        schema: UI_SETTINGS.concat(action.schema)
      };

    case SET_PREF_NO_CHANGE:
    case FETCH_SCHEMA_CACHE:
    case FETCH_PREFS_CACHE:
      return state;

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsSettingsLoading = createLoadingSelector([
  FETCH_PREFS,
  FETCH_SCHEMA
]);

export const selectIsSettingsLoaded = (state: GlobalState) =>
  state.settings.allPrefsFetched;

export const selectSettingsSchema = (state: GlobalState) =>
  state.settings.schema;
export const selectSettingsPrefs = (state: GlobalState) => state.settings.prefs;

// [Written 5/10/2019] default viewer could be missing from the prefs object
// also, there is no typing for prefs currently, so manually typing this
export type DefaultViewer =
  | "left_to_right"
  | "right_to_left"
  | "webtoon"
  | null
  | void;
export const selectDefaultViewer = (state: GlobalState): DefaultViewer =>
  state.settings.prefs.pref_default_viewer_key;

export const selectPrefValue = (state: GlobalState, key: string): PrefValue =>
  state.settings.prefs[key];

// ================================================================================
// Action Creators
// ================================================================================
type GetState = () => GlobalState;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

type FetchOptions = { ignoreCache?: boolean };

export function fetchSettings({
  ignoreCache = false
}: FetchOptions = {}): ThunkAction {
  return (dispatch, getState) => {
    if (!ignoreCache && selectIsSettingsLoaded(getState())) {
      return Promise.resolve(dispatch({ type: FETCH_PREFS_CACHE }));
    }

    dispatch({ type: FETCH_PREFS_REQUEST });

    return Server.api()
      .getPreferences()
      .then(
        preferences => dispatch({ type: FETCH_PREFS_SUCCESS, preferences }),
        error =>
          dispatch({
            type: FETCH_PREFS_FAILURE,
            errorMessage: "Failed to load your settings",
            meta: { error }
          })
      );
  };
}

export function setSetting(key: string, newValue: PrefValue): ThunkAction {
  return (dispatch, getState) => {
    // TODO: replace this getState() check with a selector
    if (selectPrefValue(getState(), key) === newValue)
      return Promise.resolve(dispatch({ type: SET_PREF_NO_CHANGE }));

    dispatch({ type: SET_PREF_REQUEST, key, newVal: newValue });

    return Server.api()
      .setPreference(key, { value: newValue })
      .then(
        () => dispatch({ type: SET_PREF_SUCCESS }),
        error =>
          dispatch({
            type: SET_PREF_FAILURE,
            errorMessage: "Failed to change setting",
            meta: { error }
          })
      );
  };
}

export function fetchSettingsSchema({
  ignoreCache = false
}: FetchOptions = {}): ThunkAction {
  return (dispatch, getState) => {
    if (!ignoreCache && selectSettingsSchema(getState()))
      return Promise.resolve(dispatch({ type: FETCH_SCHEMA_CACHE }));

    dispatch({ type: FETCH_SCHEMA_REQUEST });

    return Server.api()
      .getPreferencesSchema()
      .then(response => response.json())
      .then(
        response => dispatch({ type: FETCH_SCHEMA_SUCCESS, schema: response }),
        error =>
          dispatch({
            type: FETCH_SCHEMA_FAILURE,
            errorMessage: "Failed to fetch preference schema",
            meta: { error }
          })
      );
  };
}
