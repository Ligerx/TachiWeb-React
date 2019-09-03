// @flow
/* eslint-disable camelcase */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

// Component that currently is only used nested inside ExtensionListItem

type ExtensionButtonProps = {
  status: string,
  has_update: ?boolean,
  name: string,
  onUpdateClick: Function,
  onUninstallClick: Function,
  onInstallClick: Function
};

const ExtensionButton = ({
  status,
  has_update,
  name,
  onUpdateClick,
  onInstallClick,
  onUninstallClick
}: ExtensionButtonProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  if (status === "INSTALLED" && has_update) {
    return (
      <Button variant="contained" color="primary" onClick={onUpdateClick}>
        Update
      </Button>
    );
  }

  if (status === "INSTALLED") {
    return (
      <>
        <Button variant="outlined" onClick={() => setDialogOpen(true)}>
          Uninstall
        </Button>

        <UninstallConfirmationDialog
          name={name}
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          onUninstall={onUninstallClick}
        />
      </>
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

type DialogProps = {
  name: string,
  isOpen: boolean,
  onClose: Function,
  onUninstall: Function
};

const UninstallConfirmationDialog = ({
  name,
  isOpen,
  onClose,
  onUninstall
}: DialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Uninstall Extension - {name}?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Manga that rely on this extension will not be deleted. However, you
          will not be able to read these manga until the extension is
          reinstalled.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Go Back
        </Button>
        <Button onClick={onUninstall} color="primary">
          Uninstall
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtensionButton;
