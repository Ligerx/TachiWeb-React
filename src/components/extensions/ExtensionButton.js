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
      <React.Fragment>
        <Button variant="outlined" onClick={setDialogOpen(true)}>
          Uninstall
        </Button>

        <UninstallConfirmationDialog
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          onUninstall={onUninstallClick}
        />
      </React.Fragment>
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

type DialogProps = { isOpen: boolean, onClose: Function, onUninstall: Function };

const UninstallConfirmationDialog = ({ isOpen, onClose, onUninstall }: DialogProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Uninstall Extension?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Go Back
        </Button>
        <Button onClick={onUninstall} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtensionButton;
