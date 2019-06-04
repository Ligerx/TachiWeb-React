// @flow
import React from "react";
import { withRouter } from "react-router-dom";
import { Client } from "api";
import type { NestedSchemaEntry } from "types/settings-schema";
import type { BaseSettingsItemProps } from "components/Settings/SettingsItem";
import SettingsListItem from "components/Settings/SettingsListItem";

/**
 * Settings item representing a folder/directory of settings
 *
 * Clicking on it will allow the user to move into the directory
 */
class NestedSettingsItem extends React.Component<
  BaseSettingsItemProps & {
    schema: NestedSchemaEntry,
    history: Object
  }
> {
  handleClick = () => {
    const { history, path } = this.props;
    history.push(Client.settings(path));
  };

  render() {
    const { schema } = this.props;
    return <SettingsListItem onClick={this.handleClick} schema={schema} />;
  }
}

// Router is required to change our current location
export default withRouter(NestedSettingsItem);
