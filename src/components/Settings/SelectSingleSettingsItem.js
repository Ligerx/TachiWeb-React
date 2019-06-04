// @flow
import * as React from "react";
import type { BaseSettingsItemProps } from "components/Settings/SettingsItem";
import { currentValueOrFallback } from "components/Settings/SettingsItem";
import type { SelectSingleSchemaEntry } from "types/settings-schema";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import RadioGroup from "@material-ui/core/RadioGroup";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import SettingsListItem from "components/Settings/SettingsListItem";

type State = {
  dialogOpen: boolean, // Whether or not the editing dialog is open
  localValue: string // The displayed value of this preference (not committed to store or server)
};

/**
 * A preference allowing the user to select exactly one value out of a list of choices
 *
 * When editing this preference, a dialog is opened. The user can modify the value of the preference in the dialog
 * and the modified value is not committed to the store or server until the user confirms it.
 */
class SelectSingleSettingsItem extends React.Component<
  BaseSettingsItemProps & { schema: SelectSingleSchemaEntry },
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

  handleLocalChange = (_: any, newValue: string) =>
    this.setState(state => ({ ...state, localValue: newValue }));

  handleDialogShow = () => {
    if (this.radioGroupRef != null) this.radioGroupRef.focus();
  };

  closeDialog = () => this.setState(state => ({ ...state, dialogOpen: false }));

  // Just close dialog, do not push changes to server
  handleCancel = () => this.closeDialog();

  handleOk = () => {
    const { onUpdateSetting, schema } = this.props;
    const { localValue } = this.state;
    this.closeDialog();

    // Push changes to server
    onUpdateSetting(schema.key, localValue);
  };

  radioGroupRef: ?HTMLInputElement;

  render() {
    const { schema } = this.props;
    const { dialogOpen, localValue } = this.state;

    const current = schema.choices.find(
      it => it.id === currentValueOrFallback(this.props)
    );
    return (
      <React.Fragment>
        <SettingsListItem
          onClick={this.handleClick}
          selectedValueLabel={current != null ? current.label : null}
          schema={schema}
        />
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          open={dialogOpen}
          onEntering={this.handleDialogShow}
        >
          <DialogTitle>{schema.label}</DialogTitle>
          <DialogContent>
            <RadioGroup
              ref={ref => {
                this.radioGroupRef = ref;
              }}
              value={localValue}
              onChange={this.handleLocalChange}
            >
              {schema.choices.map(({ id, label }) => (
                <FormControlLabel
                  value={id}
                  key={id}
                  control={<Radio />}
                  label={label}
                />
              ))}
            </RadioGroup>
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
    );
  }
}

export default SelectSingleSettingsItem;
