// @flow
import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

const displayModes = [
  { flagState: 'NAME', label: 'Show title' },
  { flagState: 'NUMBER', label: 'Show chapter number' },
];

type Props = {
  open: boolean,
  value: string,
  onClose: Function,
};

type State = {
  value: string,
};

class DisplayModeDialogue extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.props.value,
    };
  }

  radioGroup = null;

  handleEntering = () => {
    this.setState({ value: this.props.value }); // reset state on open
    this.radioGroup.focus();
  };

  handleCancel = () => {
    this.props.onClose();
  };

  handleOk = () => {
    this.props.onClose(this.state.value);
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <Dialog open={this.props.open} onEntering={this.handleEntering}>
        <DialogTitle>Choose Display Mode</DialogTitle>
        <DialogContent>
          <RadioGroup
            ref={(node) => {
              this.radioGroup = node;
            }}
            aria-label="ringtone"
            name="ringtone"
            value={this.state.value}
            onChange={this.handleChange}
          >
            {displayModes.map(displayMode => (
              <FormControlLabel
                value={displayMode.flagState}
                key={displayMode.flagState}
                control={<Radio />}
                label={displayMode.label}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel}>Cancel</Button>
          <Button onClick={this.handleOk}>Select</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DisplayModeDialogue;
