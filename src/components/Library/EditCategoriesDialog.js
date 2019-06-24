// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { selectCategories } from "redux-ducks/categories";
import DialogContent from "@material-ui/core/DialogContent";

type Props = {
  isOpen: boolean,
  onClose: Function
};

const EditCategoriesDialog = ({ isOpen, onClose }: Props) => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Categories</DialogTitle>
      {/* <DialogContent> */}
      <List>
        {categories.map(category => (
          <ListItem key={category.id}>
            <ListItemIcon>
              <Icon>drag_handle</Icon>
            </ListItemIcon>
            <ListItemText primary={category.name} />
          </ListItem>
          // <ListItem>
          // <Grid container spacing={1}>
          //   <Grid item>
          //     <Icon>drag_handle</Icon>
          //   </Grid>
          //   <Grid item>
          //     <TextField />
          //   </Grid>
          // </Grid>
          // </ListItem>
        ))}
      </List>
      {/* </DialogContent> */}
    </Dialog>
  );
};

export default EditCategoriesDialog;
