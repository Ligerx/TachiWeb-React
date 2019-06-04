// @flow
import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Icon from "@material-ui/core/Icon";
import ListItemText from "@material-ui/core/ListItemText";
import type { BaseSchemaEntry } from "types/settings-schema";

type SettingsListItemProps = {
  +schema: BaseSchemaEntry,
  selectedValueLabel?: ?string, // The display name/value of the user's current selection
  children?: ?React.Node
};

/**
 * A element used to display a setting in the setting list. Used as a base for other settings.
 */
const SettingsListItem = ({
  schema,
  selectedValueLabel,
  children,
  ...otherProps
}: SettingsListItemProps) => (
  <ListItem
    button
    {...otherProps}
    disabled={schema.disabled != null && schema.disabled}
  >
    <ListItemIcon>
      <Icon>{schema.icon}</Icon>
    </ListItemIcon>
    <ListItemText
      inset
      primary={schema.label}
      secondary={
        schema.description != null ? schema.description : selectedValueLabel
      }
    />
    {children}
  </ListItem>
);

SettingsListItem.defaultProps = {
  selectedValueLabel: null,
  children: null
};

export default SettingsListItem;
