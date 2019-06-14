// @flow
import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SettingsListItem from "components/Settings/SettingsListItem";
import type { TextSchemaEntry } from "types/settings-schema";
import { currentValueOrFallback } from "components/Settings/SettingsItem";
import type { BaseSettingsItemProps } from "components/Settings/SettingsItem";

type State = {
  dialogOpen: boolean, // Whether or not the editing dialog is open
  localValue: string // The current value of the textbox in the dialog
};

// setting-type to input-type mappings
const SCHEMA_TYPE_TO_INPUT_TYPE_MAPPINGS = {
  text: "text",
  "text-password": "password"
};

/**
 * A preference allowing the user to enter arbitrary text
 *
 * When editing this preference, a dialog is opened. The user can modify the value of the preference in the dialog
 * and the modified value is not committed to the store or server until the user confirms it.
 */
class TextSettingsItem extends React.Component<
  BaseSettingsItemProps & { schema: TextSchemaEntry },
  State
> {
  state: State = {
    dialogOpen: false,
    localValue: currentValueOrFallback(this.props)
  };

  // Reset local state & open dialog
  handleClick = () =>
    this.setState(state => ({
      ...state,
      localValue: currentValueOrFallback(this.props),
      dialogOpen: true
    }));

  handleLocalChange = (event: SyntheticEvent<HTMLInputElement>) =>
    this.setState(state => ({
      ...state,
      localValue: event.currentTarget.value
    }));

  handleDialogShow = () => {
    if (this.textBoxRef != null) this.textBoxRef.focus();
  };

  closeDialog = () => this.setState(state => ({ ...state, dialogOpen: false }));

  // Just close dialog, do not push changes to server
  handleCancel = () => this.closeDialog();

  handleOk = () => {
    this.closeDialog();

    const { onUpdateSetting, schema } = this.props;
    const { localValue } = this.state;

    // Push changes to server
    onUpdateSetting(schema.key, localValue);
  };

  // Pressing 'enter' will press the 'ok' button
  handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      this.handleOk();
    }
  };

  textBoxRef: ?HTMLInputElement;

  render() {
    const { schema } = this.props;
    const { dialogOpen, localValue } = this.state;
    return (
      <>
        <SettingsListItem onClick={this.handleClick} schema={schema} />
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          open={dialogOpen}
          onEntering={this.handleDialogShow}
        >
          <DialogTitle>{schema.label}</DialogTitle>
          <DialogContent>
            <TextField
              inputRef={ref => {
                this.textBoxRef = ref;
              }}
              label={schema.label}
              value={localValue}
              onChange={this.handleLocalChange}
              onKeyPress={this.handleKeyPress}
              type={SCHEMA_TYPE_TO_INPUT_TYPE_MAPPINGS[schema.type]}
              margin="normal"
              variant="outlined"
              style={{ width: "100%" }}
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
      </>
    );
  }
}

export default TextSettingsItem;
