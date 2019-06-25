// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import EditCategoriesDraggableList from "components/Library/EditCategoriesDraggableList";

type Props = {
  isOpen: boolean,
  onClose: Function
};

const EditCategoriesDialog = ({ isOpen, onClose }: Props) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Edit Categories</DialogTitle>

      <EditCategoriesDraggableList />

      <DialogActions>
        <Button onClick={() => {}} color="primary">
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoriesDialog;
