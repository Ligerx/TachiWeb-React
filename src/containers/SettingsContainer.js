// @flow
import { connect } from "react-redux";
import type { PrefsType, State } from "redux-ducks/settings";
import {
  FETCH_PREFS,
  FETCH_SCHEMA,
  fetchSettings,
  fetchSettingsSchema,
  setSetting
} from "redux-ducks/settings";
import { createLoadingSelector } from "redux-ducks/loading";
import Settings from "pages/Settings";
import type { SchemaType } from "types/settings-schema";

const settingsAreLoading = createLoadingSelector([FETCH_PREFS, FETCH_SCHEMA]);

export type LoadedSettingsProps = {
  settingsLoaded: true,
  preferences: PrefsType,
  schema: SchemaType,
  match: Object // Object representing current user path, required to determine current setting folder
};

export type StateToProps = { settingsLoaded: false } | LoadedSettingsProps;

const mapStateToProps = (
  state: { settings: State },
  ownProps: Object
): StateToProps => {
  if (settingsAreLoading(state) || state.settings.schema == null)
    return { settingsLoaded: false };
  return {
    settingsLoaded: true,
    preferences: state.settings.prefs,
    schema: state.settings.schema,
    match: ownProps.match
  };
};

type DispatchToProps = {
  fetchSettings: Function,
  setSetting: Function,
  fetchSettingsSchema: Function
};

const mapDispatchToProps = (dispatch): DispatchToProps => ({
  fetchSettings: options => dispatch(fetchSettings(options)),
  setSetting: (key, newValue) => dispatch(setSetting(key, newValue)),
  fetchSettingsSchema: options => dispatch(fetchSettingsSchema(options))
});

export type SettingsContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
