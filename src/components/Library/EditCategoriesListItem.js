// @flow
import React, { memo } from "react";
import { useDispatch } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import { useDerivedStateFromProps } from "components/hooks";
import { updateCategoryName } from "redux-ducks/categories/actionCreators";

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

const EditCategoriesListItem = memo(({ value, id, index }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [tempValue, setTempValue] = useDerivedStateFromProps(value);

  const handleChange = (event: SyntheticInputEvent<>) => {
    setTempValue(event.target.value);
  };

  // TODO: handleBlur
  //       also handle the edge case where the tempValue is empty when onBlur is called

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
            value={tempValue}
            onChange={handleChange}
            inputProps={{ "aria-label": "bare" }}
            fullWidth
            variant="outlined"
            margin="dense"
          />
        </ListItem>
      )}
    </Draggable>
  );
});

export default EditCategoriesListItem;
