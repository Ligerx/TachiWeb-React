// @flow
import React, { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";

type Props = {
  value: string,
  id: string,
  index: number,
  TextFieldProps: Object
};

const useStyles = makeStyles({
  listItem: {
    background: "white"
  }
});

const EditCategoriesListItem = memo(
  ({ value, id, index, TextFieldProps }: Props) => {
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
              {...TextFieldProps}
            />
          </ListItem>
        )}
      </Draggable>
    );
  }
);

export default EditCategoriesListItem;
