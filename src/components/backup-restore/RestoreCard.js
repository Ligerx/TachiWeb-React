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

// React dropzone docs
// https://github.com/react-dropzone/react-dropzone

// using 'rejectedFiles' array to show if invalid files were passed
/* eslint-disable react/no-unused-state */

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

  handleDrop = (acceptedFiles: Array<File>, rejectedFiles: Array<File>) => {
    if (acceptedFiles.length) {
      this.setState({ acceptedFiles, rejectedFiles: [] });
    } else if (rejectedFiles.length) {
      this.setState({ acceptedFiles: [], rejectedFiles });
    }
  };

  // If dropzone's child node is a function, it will inject params
  // refer to dropzone docs for more details
  dropzoneContent = ({ isDragReject, acceptedFiles, rejectedFiles }: Object) => {
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
