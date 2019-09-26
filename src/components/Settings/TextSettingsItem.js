// @flow
import React, { useState, useRef } from "react";
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

type Props = BaseSettingsItemProps & { schema: TextSchemaEntry };

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
const TextSettingsItem = (props: Props) => {
  const { schema, onUpdateSetting } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [localValue, setLocalValue] = useState(currentValueOrFallback(props));

  const textBoxRef = useRef(null);

  // Reset local state & open dialog
  const handleClick = () => {
    setLocalValue(currentValueOrFallback(props));
    setDialogOpen(true);
  };

  const handleLocalChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setLocalValue(event.currentTarget.value);
  };

  const handleDialogShow = () => {
    if (textBoxRef.current != null) textBoxRef.current.focus();
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleOk = () => {
    // Push changes to server
    onUpdateSetting(schema.key, localValue);
    closeDialog();
  };

  // Pressing 'enter' will press the 'ok' button
  const handleKeyPress = (event: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleOk();
  };

  return (
    <>
      <SettingsListItem onClick={handleClick} schema={schema} />

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        open={dialogOpen}
        onEntering={handleDialogShow}
      >
        <DialogTitle>{schema.label}</DialogTitle>

        <DialogContent>
          <TextField
            inputRef={textBoxRef}
            label={schema.label}
            value={localValue}
            onChange={handleLocalChange}
            onKeyPress={handleKeyPress}
            type={SCHEMA_TYPE_TO_INPUT_TYPE_MAPPINGS[schema.type]}
            margin="normal"
            variant="outlined"
            style={{ width: "100%" }}
          />
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

export default TextSettingsItem;
