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
  id: number,
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

  const handleBlur = () => {
    if (tempValue === "") {
      // empty name is not valid, reset value
      setTempValue(value);
      return;
    }

    dispatch(updateCategoryName(id, tempValue));
  };

  return (
    <Draggable draggableId={id.toString()} index={index}>
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
            onBlur={handleBlur}
            fullWidth
            inputProps={{ "aria-label": "bare" }}
            variant="outlined"
            margin="dense"
          />
        </ListItem>
      )}
    </Draggable>
  );
});

export default EditCategoriesListItem;
