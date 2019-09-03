// @flow
import React, { memo } from "react";
import { useSelector } from "react-redux";
import List from "@material-ui/core/List";
import { selectCategories } from "redux-ducks/categories";
import EditCategoriesListItem from "components/Library/EditCategoriesListItem";

const EditCategoriesList = memo(() => {
  const categories = useSelector(selectCategories);

  return (
    <List>
      {categories.map((category, index) => (
        <EditCategoriesListItem
          key={category.id}
          name={category.name}
          id={category.id}
          index={index}
        />
      ))}
    </List>
  );
});

export default EditCategoriesList;
