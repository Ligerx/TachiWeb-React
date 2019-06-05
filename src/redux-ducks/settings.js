// @flow
import { Server } from "api";
import type { SchemaType } from "types/settings-schema";
import UI_SETTINGS from "ui-settings";
import { createLoadingSelector } from "redux-ducks/loading";

// ================================================================================
// Actions
// ================================================================================
export const FETCH_PREFS = "settings/FETCH";
const FETCH_PREFS_REQUEST = `${FETCH_PREFS}_REQUEST`;
const FETCH_PREFS_SUCCESS = `${FETCH_PREFS}_SUCCESS`;
const FETCH_PREFS_FAILURE = `${FETCH_PREFS}_FAILURE`;
const FETCH_PREFS_CACHE = `${FETCH_PREFS}_CACHE`;

export const SET_PREF = "settings/SET_PREF";
const SET_PREF_REQUEST = `${SET_PREF}_REQUEST`;
const SET_PREF_SUCCESS = `${SET_PREF}_SUCCESS`;
const SET_PREF_FAILURE = `${SET_PREF}_FAILURE`;
const SET_PREF_NO_CHANGE = `${SET_PREF}_NO_CHANGE`;

export const FETCH_SCHEMA = "settings/FETCH_SCHEMA";
const FETCH_SCHEMA_REQUEST = `${FETCH_SCHEMA}_REQUEST`;
const FETCH_SCHEMA_SUCCESS = `${FETCH_SCHEMA}_SUCCESS`;
const FETCH_SCHEMA_FAILURE = `${FETCH_SCHEMA}_FAILURE`;
const FETCH_SCHEMA_CACHE = `${FETCH_SCHEMA}_CACHE`;

// ================================================================================
// Reducers
// ================================================================================
export type PrefValue = ?(string | Array<string> | number | boolean);
export type PrefsType = { +[key: string]: PrefValue }; // Preferences stored in 'key: value' format

export type State = {
  schema: ?SchemaType,
  prefs: PrefsType,
  allPrefsFetched: boolean // Whether or not all preferences have been fetched, required as prefs can be fetch individually
};

export default function settingsReducers(
  state: State = {
    schema: null,
    prefs: {},
    allPrefsFetched: false
  },
  action: Object = {}
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

export const selectSettingsSchema = (state): ?SchemaType =>
  state.settings.schema;
export const selectSettingsPrefs = (state): PrefsType => state.settings.prefs;

// [Written 5/10/2019] default viewer could be missing from the prefs object
// also, there is no typing for prefs currently, so manually typing this
export type DefaultViewer =
  | "left_to_right"
  | "right_to_left"
  | "webtoon"
  | void;
export const selectDefaultViewer = (state): DefaultViewer =>
  state.settings.prefs.pref_default_viewer_key;

// ================================================================================
// Action Creators
// ================================================================================
type FetchOptions = { ignoreCache?: boolean };

export function fetchSettings({ ignoreCache = false }: FetchOptions = {}) {
  return (dispatch: Function, getState: Function) => {
    if (!ignoreCache && getState().settings.allPrefsFetched) {
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

export function setSetting(key: string, newValue: PrefValue) {
  return (dispatch: Function, getState: Function) => {
    if (getState().settings.prefs[key] === newValue)
      return Promise.resolve(dispatch({ type: SET_PREF_NO_CHANGE }));

    dispatch({ type: SET_PREF_REQUEST, key, newVal: newValue });

    return Server.api()
      .setPreference(key, { value: newValue })
      .then(
        () => dispatch({ type: SET_PREF_SUCCESS, key, newVal: newValue }),
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
}: FetchOptions = {}) {
  return (dispatch: Function, getState: Function) => {
    if (!ignoreCache && getState().settings.schema)
      return Promise.resolve(
        dispatch({
          type: FETCH_SCHEMA_CACHE,
          schema: getState().settings.schema
        })
      );

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
