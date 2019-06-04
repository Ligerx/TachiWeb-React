// @flow
import * as React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import type { BaseSettingsItemProps } from "components/Settings/SettingsItem";
import { currentValueOrFallback } from "components/Settings/SettingsItem";
import type { ToggleableSchemaEntry } from "types/settings-schema";
import SettingsListItem from "components/Settings/SettingsListItem";

// setting-type to element mappings
const ITEM_TYPE_TO_SCHEMA_TYPE_MAPPING = {
  switch: Switch,
  checkbox: Checkbox
};

/**
 * A two-state setting that can be toggled between 'on' and 'off'
 */
class ToggleableSettingsItem extends React.Component<
  BaseSettingsItemProps & { schema: ToggleableSchemaEntry }
> {
  handleChange = () => {
    const { onUpdateSetting, schema } = this.props;
    onUpdateSetting(schema.key, !currentValueOrFallback(this.props));
  };

  render() {
    const { schema } = this.props;
    const currentDescription = currentValueOrFallback(this.props)
      ? schema.descriptionOn
      : schema.descriptionOff;
    const ToggleElement = ITEM_TYPE_TO_SCHEMA_TYPE_MAPPING[schema.type];
    if (ToggleElement == null) return null;
    return (
      <SettingsListItem
        onClick={this.handleChange}
        selectedValueLabel={currentDescription}
        schema={schema}
      >
        <ListItemSecondaryAction>
          <ToggleElement
            onChange={this.handleChange}
            checked={currentValueOrFallback(this.props)}
          />
        </ListItemSecondaryAction>
      </SettingsListItem>
    );
  }
}

export default ToggleableSettingsItem;
