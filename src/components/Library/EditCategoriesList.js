// @flow
import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import { selectCategories } from "redux-ducks/categories";
import EditCategoriesListItem from "components/Library/EditCategoriesListItem";

const EditCategoriesList = memo(() => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);

  return (
    <List>
      {categories.map((category, index) => (
        <EditCategoriesListItem
          key={category.id}
          value={category.name}
          id={category.id.toString()}
          index={index}
        />
      ))}
    </List>
  );
});

export default EditCategoriesList;
