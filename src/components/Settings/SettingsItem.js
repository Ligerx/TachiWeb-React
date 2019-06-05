// @flow
import React from "react";
import type { PrefsType, PrefValue } from "redux-ducks/settings";
import type { MutableSchemaEntry, SchemaEntry } from "types/settings-schema";
import NestedSettingsItem from "components/Settings/NestedSettingsItem";
import ToggleableSettingsItem from "components/Settings/ToggleableSettingsItem";
import SelectSingleSettingsItem from "components/Settings/SelectSingleSettingsItem";
import TextSettingsItem from "components/Settings/TextSettingsItem";

export type UpdateSettingFunction = (key: string, newValue: PrefValue) => void;

export type BaseSettingsItemProps = {
  +prefs: PrefsType,
  +onUpdateSetting: UpdateSettingFunction, // Function called when a setting is updated by the user
  +path: Array<number> // The path in folder-indexes to the current setting
};

// schema-type to setting-element mappings
const SETTINGS_TYPE_ELEMENT_MAPPINGS = {
  nested: NestedSettingsItem,
  switch: ToggleableSettingsItem,
  checkbox: ToggleableSettingsItem,
  "select-single": SelectSingleSettingsItem,
  text: TextSettingsItem,
  "text-password": TextSettingsItem
};

/**
 * Generic settings item. Will select the correct element to use to display a setting from the type stored in the schema.
 */
const SettingsItem = (
  props: BaseSettingsItemProps & { +schema: SchemaEntry }
) => {
  const { schema } = props;
  const SettingsElement = SETTINGS_TYPE_ELEMENT_MAPPINGS[(schema.type: string)];

  return SettingsElement ? <SettingsElement {...props} /> : null;
};

/**
 * Get the current value of a preference or get it's fallback value if it currently does not have a value
 */
export function currentValueOrFallback<T>(
  props: BaseSettingsItemProps & { +schema: MutableSchemaEntry<T> }
): T {
  const result = props.prefs[props.schema.key];
  return result != null ? (result: any) : props.schema.default;
}

export default SettingsItem;
