// @flow
import * as React from "react";
import type {BaseSettingsItemProps} from "./SettingsItem";
import {currentValueOrFallback} from "./SettingsItem";
import type {ToggleableSchemaEntry} from "../../types/settings-schema";
import SettingsListItem from "./SettingsListItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";

// setting-type to element mappings
const ITEM_TYPE_TO_SCHEMA_TYPE_MAPPING = {
    'switch': Switch,
    'checkbox': Checkbox
}

/**
 * A two-state setting that can be toggled between 'on' and 'off'
 */
class ToggleableSettingsItem extends React.Component<BaseSettingsItemProps & { schema: ToggleableSchemaEntry }> {
    handleChange = () =>
        this.props.onUpdateSetting(this.props.schema.key, !currentValueOrFallback(this.props))

    render() {
        let {schema} = this.props;
        let currentDescription = currentValueOrFallback(this.props) ? schema.descriptionOn : schema.descriptionOff
        let ToggleElement = ITEM_TYPE_TO_SCHEMA_TYPE_MAPPING[schema.type];
        if (ToggleElement == null) return null
        return (
            <SettingsListItem onClick={this.handleChange} selectedValueLabel={currentDescription} schema={schema}>
                <ListItemSecondaryAction>
                    <ToggleElement onChange={this.handleChange} checked={currentValueOrFallback(this.props)}/>
                </ListItemSecondaryAction>
            </SettingsListItem>
        )
    }
}

export default ToggleableSettingsItem;
