// @flow
/* eslint-disable camelcase */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

// Component that currently is only used nested inside ExtensionListItem

type ExtensionButtonProps = {
  status: string,
  has_update: ?boolean,
  onUpdateClick: Function,
  onUninstallClick: Function,
  onInstallClick: Function
};

const ExtensionButton = ({
  status,
  has_update,
  onUpdateClick,
  onUninstallClick,
  onInstallClick
}: ExtensionButtonProps) => {
  if (status === "INSTALLED" && has_update) {
    return (
      <Button variant="contained" color="primary" onClick={onUpdateClick}>
        Update
      </Button>
    );
  }

  if (status === "INSTALLED") {
    return (
      <Button variant="outlined" onClick={onUninstallClick}>
        Uninstall
      </Button>
    );
  }

  return (
    <Button variant="outlined" onClick={onInstallClick}>
      Install
    </Button>
  );

  // Not handling the untrusted case right now
  // return "Untrusted";
};

const UninstallConfirmationDialog = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onClose={setOpen(false)}>
      <DialogTitle>Uninstall Extension?</DialogTitle>
      <DialogActions>
        <Button onClick={setOpen(false)} color="primary">
          Go Back
        </Button>
        <Button onClick={this.handleClose} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtensionButton;
