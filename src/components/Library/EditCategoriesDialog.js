// @flow
import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import EditCategoriesDraggableList from "components/Library/EditCategoriesDraggableList";
import { useCreateCategory } from "apiHooks";

type Props = {
  isOpen: boolean,
  onClose: Function
};

const EditCategoriesDialog = ({ isOpen, onClose }: Props) => {
  const createCategory = useCreateCategory();

  const handleAddCategory = () => {
    createCategory();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth scroll="body">
      <DialogTitle>Edit Categories</DialogTitle>

      <EditCategoriesDraggableList />

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={handleAddCategory} color="primary">
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoriesDialog;
