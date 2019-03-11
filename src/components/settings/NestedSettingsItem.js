// @flow
import React from 'react';
import type {NestedSchemaEntry} from "../../types/settings-schema";
import type {BaseSettingsItemProps} from "./SettingsItem";
import SettingsListItem from "./SettingsListItem";
import {withRouter} from "react-router-dom";
import {Client} from 'api'

/**
 * Settings item representing a folder/directory of settings
 *
 * Clicking on it will allow the user to move into the directory
 */
class NestedSettingsItem extends React.Component<BaseSettingsItemProps & {
    schema: NestedSchemaEntry,
    history: Object
}> {
    handleClick = () => {
        this.props.history.push(Client.settings(this.props.path))
    }

    render() {
        let {schema} = this.props;
        return (
            <SettingsListItem onClick={this.handleClick} schema={schema}/>
        )
    }
}

// Router is required to change our current location
export default withRouter(NestedSettingsItem);
