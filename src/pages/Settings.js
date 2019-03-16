// @flow
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuDrawer from "components/MenuDrawer";
import List from "@material-ui/core/List";
import { Client } from "api";
import type {
  LoadedSettingsProps,
  SettingsContainerProps
} from "containers/SettingsContainer";
import FullScreenLoading from "components/loading/FullScreenLoading";
import SettingsItem from "components/settings/SettingsItem";
import type { PrefValue } from "redux-ducks/settings";
import type { SchemaType } from "types/settings-schema";
import BackButton from "components/BackButton";

// The name of the path parameter describing the setting folder the user is currently viewing
export const SETTING_INDEX = "settingIndex";

// Split the path into a stack of indexes describing which folders the user has entered
function splitSettingsPath(props: LoadedSettingsProps): Array<number> {
  const settingsPath = props.match.params[SETTING_INDEX];
  if (settingsPath == null) return [];
  return settingsPath
    .split("/")
    .map(it => it.trim())
    .filter(it => it.length > 0)
    .map(it => parseInt(it, 10));
}

/**
 * The base settings page
 */
class Settings extends Component<SettingsContainerProps> {
  componentDidMount(): void {
    const { fetchSettings, fetchSettingsSchema } = this.props;

    fetchSettings().then(fetchSettingsSchema);
  }

  handleSettingsUpdate = (key: string, value: PrefValue) => {
    const { setSetting } = this.props;
    setSetting(key, value);
  };

  parseInfo = (props: LoadedSettingsProps) => {
    let currentTitle: ?string = null;
    let currentSchema: SchemaType = props.schema;

    const split = splitSettingsPath(props);
    for (let i = 0; i < split.length; i += 1) {
      const settingIndex = split[i];
      const nextSchema = currentSchema[settingIndex];
      if (nextSchema.type === "nested") {
        currentSchema = nextSchema.prefs;
        currentTitle = nextSchema.label;
      } else break;
    }

    return {
      title: currentTitle, // The title of the current folder, null at top level
      schema: currentSchema, // The list of preferences in the current folder
      path: split // The path to the current folder
    };
  };

  render() {
    const copiedProps = { ...this.props }; // Copy the props (resolves some type issues)
    const info = copiedProps.settingsLoaded
      ? this.parseInfo((copiedProps: any) /* useless cast, flow bug */)
      : null;

    return (
      <React.Fragment>
        <Helmet>
          <title>Settings - TachiWeb</title>
        </Helmet>

        <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
          <Toolbar>
            {info != null && info.path.length > 0 ? (
              <BackButton
                onBackClick={Client.settings(info.path.slice(0, -1))}
              />
            ) : (
              <MenuDrawer />
            )}
            <Typography variant="title">
              {info != null && info.title != null ? info.title : "Settings"}
            </Typography>
          </Toolbar>
        </AppBar>

        <List component="nav">
          {info != null ? (
            info.schema.map((it, index) => (
              <SettingsItem
                key={
                  // This array is static, so the below eslint rule is pointless
                  // eslint-disable-next-line react/no-array-index-key
                  index
                }
                path={info.path.concat([index])}
                schema={it}
                prefs={copiedProps.preferences}
                onUpdateSetting={this.handleSettingsUpdate}
              />
            ))
          ) : (
            <FullScreenLoading />
          )}
        </List>
      </React.Fragment>
    );
  }
}

export default Settings;
