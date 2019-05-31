// @flow
import { connect } from "react-redux";
import type { PrefsType } from "redux-ducks/settings";
import {
  selectIsSettingsLoading,
  selectSettingsSchema,
  selectSettingsPrefs,
  fetchSettings,
  fetchSettingsSchema,
  setSetting
} from "redux-ducks/settings";
import Settings from "pages/Settings";
import type { SchemaType } from "types/settings-schema";

type StateToProps = {
  settingsLoaded: boolean,
  preferences: PrefsType,
  schema: ?SchemaType,

  match: Object // Object representing current user path, required to determine current setting folder
};

const mapStateToProps = (
  state: StateToProps,
  ownProps: Object
): StateToProps => {
  return {
    settingsLoaded: selectIsSettingsLoading(state),
    preferences: selectSettingsPrefs(state),
    schema: selectSettingsSchema(state),
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
