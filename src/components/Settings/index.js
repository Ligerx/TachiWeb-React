// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import MenuDrawer from "components/MenuDrawer";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import SettingsItem from "components/Settings/SettingsItem";
import BackButton from "components/BackButton";
import {
  selectIsSettingsLoading,
  selectSettingsSchema,
  selectSettingsPrefs,
  fetchSettings,
  fetchSettingsSchema,
  setSetting
} from "redux-ducks/settings";
import { Client } from "api";
import type { PrefValue } from "redux-ducks/settings";
import type { SchemaType } from "types/settings-schema";

// The name of the path parameter describing the setting folder the user is currently viewing
export const SETTING_INDEX = "settingIndex";

// Split the path into a stack of indexes describing which folders the user has entered
function splitSettingsPath(params): Array<number> {
  const settingsPath = params[SETTING_INDEX];
  if (settingsPath == null) return [];
  return settingsPath
    .split("/")
    .map(it => it.trim())
    .filter(it => it.length > 0)
    .map(it => parseInt(it, 10));
}

function parseInfo(schema: ?SchemaType, params) {
  if (schema == null) return {};

  let currentTitle: ?string = null;
  let currentSchema: SchemaType = [...schema];
  const split = splitSettingsPath(params);

  for (let i = 0; i < split.length; i += 1) {
    const settingIndex = split[i];
    const nextSchema = schema[settingIndex];

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
}

type Props = { match: { params: Object } };

const Settings = ({ match }: Props) => {
  const settingsLoaded = useSelector(selectIsSettingsLoading);
  const preferences = useSelector(selectSettingsPrefs);
  const schema = useSelector(selectSettingsSchema);

  const dispatch = useDispatch();
  const handleSetSetting = (key: string, newValue: PrefValue) =>
    dispatch(setSetting(key, newValue));

  const info = parseInfo(schema, match.params);

  useEffect(() => {
    dispatch(fetchSettings()).then(() => dispatch(fetchSettingsSchema()));
  }, [dispatch]);

  if (info == null || info.schema == null) return null;

  return (
    <React.Fragment>
      <Helmet title="Settings - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          {info != null && info.path.length > 0 ? (
            <BackButton onBackClick={Client.settings(info.path.slice(0, -1))} />
          ) : (
            <MenuDrawer />
          )}
          <Typography variant="h6">
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
              prefs={preferences}
              onUpdateSetting={handleSetSetting}
            />
          ))
        ) : (
          <FullScreenLoading />
        )}
      </List>
    </React.Fragment>
  );
};

export default Settings;
