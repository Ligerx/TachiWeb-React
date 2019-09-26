// @flow
import * as React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import type { BaseSettingsItemProps } from "components/Settings/SettingsItem";
import { currentValueOrFallback } from "components/Settings/SettingsItem";
import type { ToggleableSchemaEntry } from "types/settings-schema";
import SettingsListItem from "components/Settings/SettingsListItem";

type Props = BaseSettingsItemProps & { schema: ToggleableSchemaEntry };

// setting-type to element mappings
const ITEM_TYPE_TO_SCHEMA_TYPE_MAPPING = {
  switch: Switch,
  checkbox: Checkbox
};

/**
 * A two-state setting that can be toggled between 'on' and 'off'
 */
const ToggleableSettingsItem = (props: Props) => {
  const { onUpdateSetting, schema } = props;

  const handleChange = () => {
    onUpdateSetting(schema.key, !currentValueOrFallback(props));
  };

  const currentDescription = currentValueOrFallback(props)
    ? schema.descriptionOn
    : schema.descriptionOff;

  const ToggleElement = ITEM_TYPE_TO_SCHEMA_TYPE_MAPPING[schema.type];

  if (ToggleElement == null) return null;

  return (
    <SettingsListItem
      onClick={handleChange}
      selectedValueLabel={currentDescription}
      schema={schema}
    >
      <ListItemSecondaryAction>
        <ToggleElement
          onChange={handleChange}
          checked={currentValueOrFallback(props)}
        />
      </ListItemSecondaryAction>
    </SettingsListItem>
  );
};

export default ToggleableSettingsItem;
