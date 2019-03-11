// @flow
import type {PrefsType, PrefValue} from "../../redux-ducks/settings";
import type {MutableSchemaEntry, SchemaEntry} from "../../types/settings-schema";
import NestedSettingsItem from "./NestedSettingsItem";
import React from "react";
import ToggleableSettingsItem from "./ToggleableSettingsItem";
import SelectSingleSettingsItem from "./SelectSingleSettingsItem";
import TextSettingsItem from "./TextSettingsItem";

export type BaseSettingsItemProps = {
    +prefs: PrefsType,
    +onUpdateSetting: UpdateSettingFunction, // Function called when a setting is updated by the user
    +path: Array<number> // The path in folder-indexes to the current setting
}

export type UpdateSettingFunction = (key: string, newValue: PrefValue) => void

// schema-type to setting-element mappings
const SETTINGS_TYPE_ELEMENT_MAPPINGS = {
    'nested': NestedSettingsItem,
    'switch': ToggleableSettingsItem,
    'checkbox': ToggleableSettingsItem,
    'select-single': SelectSingleSettingsItem,
    'text': TextSettingsItem,
    'text-password': TextSettingsItem
}

/**
 * Generic settings item. Will select the correct element to use to display a setting from the type stored in the schema.
 */
const SettingsItem = (props: BaseSettingsItemProps & { +schema: SchemaEntry }) => {
    const SettingsElement = SETTINGS_TYPE_ELEMENT_MAPPINGS[(props.schema.type: string)];

    return SettingsElement ? <SettingsElement {...props} /> : null
}

/**
 * Get the current value of a preference or get it's fallback value if it currently does not have a value
 */
export function currentValueOrFallback<T>(props: BaseSettingsItemProps & { +schema: MutableSchemaEntry<T> }): T {
    let result = props.prefs[props.schema.key]
    return result != null ? (result: any) : props.schema.default
}

export default SettingsItem
