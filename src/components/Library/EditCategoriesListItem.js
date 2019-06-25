// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";

type Props = {
  value: string,
  id: string,
  index: number
};

const useStyles = makeStyles({
  listItem: {
    background: "white"
  }
});

const EditCategoriesListItem = ({ value, id, index }: Props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <ListItem
          className={classes.listItem}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <ListItemIcon>
            <Icon {...provided.dragHandleProps}>drag_handle</Icon>
          </ListItemIcon>
          <TextField
            value={value}
            inputProps={{ "aria-label": "bare" }}
            fullWidth
            variant="outlined"
            margin="dense"
          />
        </ListItem>
      )}
    </Draggable>
  );
};

export default EditCategoriesListItem;
