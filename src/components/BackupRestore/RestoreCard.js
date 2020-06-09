// @flow
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import RestoreDialog from "components/BackupRestore/RestoreDialog";
import { useUploadRestoreFile } from "apiHooks";

// TODO: clear all files from state when user successfully restores library

// TODO: use custom styling for dropzone
//       I'm currently using the default styles included with dropzone (which I copied over).
//
// Can use this for reference (and copy code)
// https://css-tricks.com/drag-and-drop-file-uploading/

// About the [accept="application/json,.json"]
// https://stackoverflow.com/questions/46663063/inputs-accept-attribute-doesnt-recognise-application-json

// React dropzone docs
// https://github.com/react-dropzone/react-dropzone

// using 'rejectedFiles' array to show if invalid files were passed
/* eslint-disable react/no-unused-state */

const useStyles = makeStyles({
  icon: { marginRight: 8 },
  button: {
    width: "100%",
    marginTop: 16
  },
  dropzoneDefault: {
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 5,

    width: "100%",
    height: 200,
    padding: 16
  },
  dropzoneActive: {
    borderStyle: "solid",
    borderColor: "#6c6",
    backgroundColor: "#eee"
  },
  // Dragging a file that won't be accepted will add both the active and rejected class
  // using '!important' to force the correct borderColor. (this is just how dropzone works I guess)
  dropzoneRejected: {
    borderColor: "#c66 !important"
  }
});

// If dropzone's child node is a function, it will inject params
// refer to dropzone docs for more details
const dropzoneContent = ({
  isDragReject,
  acceptedFiles,
  rejectedFiles
}: Object) => {
  if (isDragReject) {
    return "Only a single JSON backup file is accepted";
  }
  if (rejectedFiles.length) {
    return "Invalid file selected";
  }
  if (acceptedFiles.length) {
    return `${acceptedFiles[0].name}`;
  }
  return "Drag and Drop or Click Here to upload your backup file";
};

const RestoreCard = ({ ...otherProps }: {}) => {
  const classes = useStyles();

  const uploadRestoreFile = useUploadRestoreFile();

  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [dialogueOpen, setDialogueOpen] = useState(false);

  const handleDrop = (
    newAcceptedFiles: Array<File>,
    newRejectedFiles: Array<File>
  ) => {
    setAcceptedFiles(newAcceptedFiles);
    setRejectedFiles(newRejectedFiles);
  };

  const handleUpload = () => {
    // Checking that files exist just in case (even though button should be disabled)
    if (acceptedFiles.length) {
      uploadRestoreFile(acceptedFiles[0]);
      setDialogueOpen(true);
    }
  };

  const handleCloseDialog = () => setDialogueOpen(false);

  const buttonDisabled: boolean =
    acceptedFiles.length !== 1 || rejectedFiles.length > 0;

  return (
    <>
      <Card {...otherProps}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            Restore Your Library
          </Typography>

          <Dropzone
            className={classes.dropzoneDefault}
            activeClassName={classes.dropzoneActive}
            acceptClassName={classes.dropzoneAccept}
            rejectClassName={classes.dropzoneRejected}
            onDrop={handleDrop}
            multiple={false}
            accept="application/json,.json"
          >
            {dropzoneContent}
          </Dropzone>

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            disabled={buttonDisabled}
            onClick={handleUpload}
          >
            <Icon className={classes.icon}>cloud_upload</Icon>
            Restore
          </Button>
        </CardContent>
      </Card>

      <RestoreDialog
        open={dialogueOpen}
        onClose={handleCloseDialog}
        tryAgain={handleUpload}
      />
    </>
  );
};

export default RestoreCard;
