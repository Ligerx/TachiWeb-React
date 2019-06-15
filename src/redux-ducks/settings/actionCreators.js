// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import type { PrefValue } from "types";
import {
  selectIsSettingsLoaded,
  selectSettingsSchema,
  selectPrefValue
} from ".";
import {
  FETCH_PREFS_REQUEST,
  FETCH_PREFS_SUCCESS,
  FETCH_PREFS_FAILURE,
  FETCH_PREFS_CACHE,
  SET_PREF_NO_CHANGE,
  SET_PREF_REQUEST,
  SET_PREF_SUCCESS,
  SET_PREF_FAILURE,
  FETCH_SCHEMA_REQUEST,
  FETCH_SCHEMA_CACHE,
  FETCH_SCHEMA_SUCCESS,
  FETCH_SCHEMA_FAILURE
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
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
