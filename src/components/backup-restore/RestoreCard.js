// @flow
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Dropzone from 'react-dropzone';

// TODO: different UI states after submitting an uploaded file.
//       Restoring doesn't work right now so I don't have any real state changes to work with.

// About the [accept="application/json,.json"]
// https://stackoverflow.com/questions/46663063/inputs-accept-attribute-doesnt-recognise-application-json

type Props = {
  onClickRestore: Function,
};

type State = {
  acceptedFiles: Array<File>,
  rejectedFiles: Array<File>,
};

class RestoreCard extends Component<Props, State> {
  state = {
    // Only accept 1 file, but dropzone gives us an array regardless
    acceptedFiles: [],
    rejectedFiles: [],
  };

  handleDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length) {
      this.setState({ acceptedFiles, rejectedFiles: [] });
    } else if (rejectedFiles.length) {
      this.setState({ acceptedFiles: [], rejectedFiles });
    }
  };

  // if dropzone is given a children of type function, it will call it and inject the below params
  dropzoneContent = ({
    isDragActive, isDragReject, acceptedFiles, rejectedFiles,
  }) => {
    if (isDragReject) {
      return 'Only JSON backup files are accepted';
    } else if (rejectedFiles.length) {
      return 'Invalid file selected';
    } else if (acceptedFiles.length) {
      return `${acceptedFiles[0].name}`;
    }
    return 'Drag and Drop or Click Here to upload your backup file';
  };

  handleClick = () => {
    const { onClickRestore } = this.props;
    const { acceptedFiles } = this.state;

    // Checking that files exist just in case (even though button should be disabled)
    if (acceptedFiles.length) {
      onClickRestore(acceptedFiles[0]);
    }
  };

  render() {
    const buttonDisabled = !this.state.acceptedFiles.length;

    return (
      <Paper>
        <Dropzone onDrop={this.handleDrop} multiple={false} accept="application/json,.json">
          {this.dropzoneContent}
        </Dropzone>

        <Button
          variant="raised"
          color="primary"
          disabled={buttonDisabled}
          onClick={this.handleClick}
        >
          <Icon>cloud_upload</Icon>
          Restore
        </Button>
      </Paper>
    );
  }
}

export default RestoreCard;
