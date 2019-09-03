// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";

type Props = {
  open: boolean,
  onClose: Function,
  onDelete: Function
};

const UnfavoriteMultipleMangaDialog = ({ open, onClose, onDelete }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove these manga?
        </DialogContentText>
        {/* TODO: Implement chapter deleting functionality */}
        {/* <FormControlLabel
          control={<Checkbox checked={false} onChange={() => {}} />}
          label="Also delete downloaded chapters"
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Go Back
        </Button>
        <Button onClick={onDelete} color="primary">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnfavoriteMultipleMangaDialog;
