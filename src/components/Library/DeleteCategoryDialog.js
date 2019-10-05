// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

type Props = {
  open: boolean,
  onClose: Function,
  onDelete: Function
};

const DeleteCategoryDialog = ({ open, onClose, onDelete }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Category?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
