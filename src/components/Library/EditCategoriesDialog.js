// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import { selectCategories } from "redux-ducks/categories";

type Props = {
  isOpen: boolean,
  onClose: Function
};

const EditCategoriesDialog = ({ isOpen, onClose }: Props) => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Edit Categories</DialogTitle>
      <List>
        {categories.map(category => (
          <ListItem key={category.id}>
            <ListItemIcon>
              <Icon>drag_handle</Icon>
            </ListItemIcon>
            <TextField
              value={category.name}
              inputProps={{ "aria-label": "bare" }}
              fullWidth
              variant="outlined"
              margin="dense"
            />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={() => {}} color="primary">
          Add Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCategoriesDialog;
