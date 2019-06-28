// @flow
import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import { useDerivedStateFromProps } from "components/hooks";
import { updateCategoryName } from "redux-ducks/categories/actionCreators";
import DeleteCategoryDialog from "components/Library/DeleteCategoryDialog";

type Props = {
  name: string,
  id: number,
  index: number
};

const useStyles = makeStyles({
  listItem: {
    background: "white"
  },
  deleteIcon: {
    marginLeft: "auto",
    cursor: "pointer"
  }
});

const EditCategoriesListItem = memo(({ name, id, index }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [tempName, setTempName] = useDerivedStateFromProps(name);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleChange = (event: SyntheticInputEvent<>) => {
    setTempName(event.target.value);
  };

  const handleBlur = () => {
    if (tempName === name) return;
    if (tempName === "") {
      // empty name is not valid, reset value
      setTempName(name);
      return;
    }

    dispatch(updateCategoryName(id, tempName));
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    // dispatch(deleteCategory(id));
  };

  return (
    <>
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
              value={tempName}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              inputProps={{ "aria-label": "bare" }}
              variant="outlined"
              margin="dense"
            />
            <ListItemIcon>
              <Icon
                onClick={() => setDeleteOpen(true)}
                className={classes.deleteIcon}
              >
                delete
              </Icon>
            </ListItemIcon>
          </ListItem>
        )}
      </Draggable>

      <DeleteCategoryDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
});

export default EditCategoriesListItem;
