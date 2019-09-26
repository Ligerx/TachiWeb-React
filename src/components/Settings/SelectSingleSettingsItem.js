// @flow
import React, { useState, useRef } from "react";
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

type Props = BaseSettingsItemProps & { schema: SelectSingleSchemaEntry };

/**
 * A preference allowing the user to select exactly one value out of a list of choices
 *
 * When editing this preference, a dialog is opened. The user can modify the value of the preference in the dialog
 * and the modified value is not committed to the store or server until the user confirms it.
 */
const SelectSingleSettingsItem = (props: Props) => {
  const { schema, onUpdateSetting } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [localValue, setLocalValue] = useState(currentValueOrFallback(props));

  const radioGroupRef = useRef(null);

  // Reset local state & open dialog
  const handleClick = () => {
    setLocalValue(currentValueOrFallback(props));
    setDialogOpen(true);
  };

  const handleLocalChange = (_: any, newValue: string) => {
    setLocalValue(newValue);
  };

  const handleDialogShow = () => {
    if (radioGroupRef.current != null) radioGroupRef.current.focus();
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleOk = () => {
    // Push changes to server
    onUpdateSetting(schema.key, localValue);
    closeDialog();
  };

  const current = schema.choices.find(
    it => it.id === currentValueOrFallback(props)
  );

  return (
    <>
      <SettingsListItem
        onClick={handleClick}
        selectedValueLabel={current != null ? current.label : null}
        schema={schema}
      />

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        open={dialogOpen}
        onEntering={handleDialogShow}
      >
        <DialogTitle>{schema.label}</DialogTitle>

        <DialogContent>
          <RadioGroup
            ref={radioGroupRef}
            value={localValue}
            onChange={handleLocalChange}
          >
            {schema.choices.map(({ id, label }) => (
              <FormControlLabel
                key={id}
                value={id}
                control={<Radio />}
                label={label}
              />
            ))}
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SelectSingleSettingsItem;
