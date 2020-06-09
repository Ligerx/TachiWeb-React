// @flow
import React, { useState, useRef } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

// Renders a Dialogue with a RadioGroup of options.
// onClose function should handle setting open = false.
// This passes a new value to onClose when the user makes a new selection.

type Props = {
  title: string,
  open: boolean,
  value: string,
  options: Array<{ flagState: string, label: string }>,
  onClose: Function
};

const RadioOptionsDialogue = ({
  title,
  open,
  value,
  options,
  onClose
}: Props) => {
  const [localValue, setLocalValue] = useState(value);

  const radioGroup = useRef(null);

  const handleEntering = () => {
    setLocalValue(value); // reset state on open
    if (radioGroup.current) {
      radioGroup.current.focus();
    }
  };

  const handleOk = () => {
    onClose(localValue);
  };

  const handleChange = (event: SyntheticEvent<>, newValue: string) => {
    setLocalValue(newValue);
  };

  return (
    <Dialog open={open} onEntering={handleEntering} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <RadioGroup ref={radioGroup} value={localValue} onChange={handleChange}>
          {options.map(option => (
            <FormControlLabel
              value={option.flagState}
              key={option.flagState}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RadioOptionsDialogue;
