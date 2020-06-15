// @flow
import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import CenteredLoading from "components/Loading/CenteredLoading";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Client } from "api";
import Link from "components/Link";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  dialog: {
    width: 320,
    height: 126 // TODO: using an arbitrary height for all dialog states. Make this less bad.
  }
});

type Props = {
  open: boolean,
  onClose: Function,
  tryAgain: Function,
  isLoading: boolean,
  didFail: boolean
};

const RestoreDialog = ({
  open,
  onClose,
  tryAgain,
  isLoading,
  didFail
}: Props) => {
  const classes = useStyles();

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const content = () => {
    if (isLoading) {
      return (
        <>
          <DialogTitle>Restoring Library...</DialogTitle>
          <CenteredLoading />
        </>
      );
    }

    if (didFail) {
      return (
        <>
          <DialogTitle>Failed to Restore Library</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={tryAgain} color="primary" autoFocus>
              Try Again
            </Button>
          </DialogActions>
        </>
      );
    }

    return (
      <>
        <DialogTitle>Restore Successful</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button component={Link} to={Client.library()} color="primary">
            Go To Library
          </Button>
        </DialogActions>
      </>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ paper: classes.dialog }}
    >
      {content()}
    </Dialog>
  );
};

export default RestoreDialog;
