// @flow
import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import List from "@material-ui/core/List";
import { selectCategories } from "redux-ducks/categories";
import { updateCategoryName } from "redux-ducks/categories/actionCreators";
import EditCategoriesListItem from "components/Library/EditCategoriesListItem";

const EditCategoriesList = memo(() => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);

  const handleChange = (id: number) => (event: SyntheticInputEvent<>) => {
    // Directly updating the redux state without updating on the server
    dispatch(updateCategoryName(id, event.target.value));
  };

  const handleBlur = (id: number) => () => {
    // dispatch(updateCategoryName(id));
  };

  return (
    <List>
      {categories.map((category, index) => (
        <EditCategoriesListItem
          key={category.id}
          value={category.name}
          id={category.id.toString()}
          index={index}
          TextFieldProps={{
            onChange: handleChange(category.id),
            onBlur: handleBlur(category.id)
          }}
        />
      ))}
    </List>
  );
});

export default EditCategoriesList;
