// @flow
import * as React from "react";
import type {BaseSettingsItemProps} from "./SettingsItem";
import {currentValueOrFallback} from "./SettingsItem";
import type {TextSchemaEntry} from "../../types/settings-schema";
import SettingsListItem from "./SettingsListItem";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

type State = {
    dialogOpen: boolean, // Whether or not the editing dialog is open
    localValue: string // The current value of the textbox in the dialog
}

// setting-type to input-type mappings
const SCHEMA_TYPE_TO_INPUT_TYPE_MAPPINGS = {
    'text': 'text',
    'text-password': 'password'
}

/**
 * A preference allowing the user to enter arbitrary text
 *
 * When editing this preference, a dialog is opened. The user can modify the value of the preference in the dialog
 * and the modified value is not committed to the store or server until the user confirms it.
 */
class TextSettingsItem extends React.Component<BaseSettingsItemProps & { schema: TextSchemaEntry }, State> {
    state: State = {dialogOpen: false, localValue: currentValueOrFallback(this.props)}

    textBoxRef: ?HTMLInputElement

    // Reset local state & open dialog
    handleClick = () =>
        this.setState(state => ({...state, localValue: currentValueOrFallback(this.props), dialogOpen: true}))

    handleLocalChange = (event: SyntheticEvent<HTMLInputElement>) =>
        this.setState({...this.state, localValue: event.currentTarget.value})

    handleDialogShow = () => {
        if (this.textBoxRef != null)
            this.textBoxRef.focus()
    }

    closeDialog = () => this.setState(state => ({...state, dialogOpen: false}))

    // Just close dialog, do not push changes to server
    handleCancel = () => this.closeDialog()

    handleOk = () => {
        this.closeDialog()

        // Push changes to server
        this.props.onUpdateSetting(this.props.schema.key, this.state.localValue)
    }

    // Pressing 'enter' will press the 'ok' button
    handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.handleOk()
        }
    }

    render() {
        let {schema} = this.props;
        return (
            <React.Fragment>
                <SettingsListItem onClick={this.handleClick} schema={schema}/>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    maxWidth="xs"
                    open={this.state.dialogOpen}
                    onEntering={this.handleDialogShow}>
                    <DialogTitle>{schema.label}</DialogTitle>
                    <DialogContent>
                        <TextField
                            inputRef={ref => {
                                this.textBoxRef = ref;
                            }}
                            label={schema.label}
                            value={this.state.localValue}
                            onChange={this.handleLocalChange}
                            onKeyPress={this.handleKeyPress}
                            type={SCHEMA_TYPE_TO_INPUT_TYPE_MAPPINGS[schema.type]}
                            margin="normal"
                            variant="outlined"
                            style={{width: '100%'}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleOk} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

export default TextSettingsItem;
