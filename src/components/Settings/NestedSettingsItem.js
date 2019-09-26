// @flow
import React from "react";
import { withRouter } from "react-router-dom";
import { Client } from "api";
import type { NestedSchemaEntry } from "types/settings-schema";
import type { BaseSettingsItemProps } from "components/Settings/SettingsItem";
import SettingsListItem from "components/Settings/SettingsListItem";

type Props = BaseSettingsItemProps & {
  schema: NestedSchemaEntry,
  history: { push: Function }
};

/**
 * Settings item representing a folder/directory of settings
 *
 * Clicking on it will allow the user to move into the directory
 */
const NestedSettingsItem = ({ schema, history: { push }, path }: Props) => {
  const handleClick = () => {
    push(Client.settings(path));
  };

  return <SettingsListItem onClick={handleClick} schema={schema} />;
};

// Router is required to change our current location
export default withRouter(NestedSettingsItem);
