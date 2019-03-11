// @flow

/**
 * Defines the format of the preference schema.
 *
 * The preference schema defines how the preference UI is displayed.
 *
 * The schema is assembled from the schema-part stored in the application and the schema-part fetched from the server.
 */

// The schema: an array of preferences to be displayed.
export type SchemaType = Array<SchemaEntry>
// A schema entry: Represents the display properties of a single preference
export type SchemaEntry = NestedSchemaEntry
    | SelectSingleSchemaEntry
    | ToggleableSchemaEntry
    | TextSchemaEntry

// The properties all schema entries must have
export type BaseSchemaEntry = {
    label: string, // The display name of the preference
    icon?: ?string, // The material icon of the preference. null for no icon.
    description?: ?string, // Preference description, will show currently selected value if description is missing
    disabled?: ?boolean // Whether or not the preference is disabled
}

// A preference that can be changed
export type MutableSchemaEntry<T> = {
    key: string, // The identifier for this preference. Must be unique across all preferences
    default: T // The default value for this preference.
} & BaseSchemaEntry

// A folder of preferences.
export type NestedSchemaEntry = {
    type: 'nested',
    prefs: SchemaType // The preferences contained in this folder
} & BaseSchemaEntry

// A preference allowing the user to select exactly one value out of a list of choices
export type SelectSingleSchemaEntry = {
    type: 'select-single',
    choices: Array<{ // An array of the possible choices for this preference
        id: string, // The identifier for this choice. Must be unique across all choices in this preference.
        label: string // The display name for this choice
    }>
} & MutableSchemaEntry<string>

// A preference allowing the user to enter arbitrary text
export type TextSchemaEntry = {
    type: 'text' | 'text-password',
} & MutableSchemaEntry<string>

// A preference that can be toggled between two states
export type ToggleableSchemaEntry = {
    type: 'switch' | 'checkbox',
    descriptionOn?: ?string, // The description shown when the user's selection is: 'on'
    descriptionOff?: ?string // The description shown when the user's selection is: 'off'
} & MutableSchemaEntry<boolean>
