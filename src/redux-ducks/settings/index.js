// @flow
import type { SchemaType } from "types/settings-schema";
import { createSelector } from "reselect";
import UI_SETTINGS from "ui-settings";
import { createLoadingSelector } from "redux-ducks/loading";
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { PrefValue, PrefsType, SettingViewerType } from "types";
import {
  FETCH_PREFS,
  FETCH_PREFS_SUCCESS,
  SET_PREF_REQUEST,
  FETCH_SCHEMA,
  FETCH_SCHEMA_SUCCESS
} from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  schema: ?SchemaType,
  prefs: PrefsType,
  allPrefsFetched: boolean // Whether or not all preferences have been fetched, required as prefs can be fetch individually
}>;

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

export const selectPrefValue = (state: GlobalState, key: string): PrefValue =>
  state.settings.prefs[key];

export const selectDefaultViewer = (state: GlobalState): SettingViewerType =>
  state.settings.prefs.pref_default_viewer_key;

// caching arrays to keep selectors pure
const initialEnabledLanguages = ["en"];
const emptyArray = [];

export const selectSourcesEnabledLanguages = (
  state: GlobalState
): $ReadOnlyArray<string> => {
  const { enabledLanguages } = state.settings.prefs;

  if (enabledLanguages == null) return initialEnabledLanguages;
  return state.settings.prefs.enabledLanguages;
};

export const selectHiddenSources = (
  state: GlobalState
): $ReadOnlyArray<string> => {
  const { hiddenSources } = state.settings.prefs;

  if (hiddenSources == null) return emptyArray;
  return state.settings.prefs.hiddenSources;
};
