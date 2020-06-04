// @flow
import React, { memo } from "react";
import List from "@material-ui/core/List";
import EditCategoriesListItem from "components/Library/EditCategoriesListItem";
import { useCategories } from "components/apiHooks";

const EditCategoriesList = memo<{}>(() => {
  const { data: categories } = useCategories();

  if (categories == null) return null;

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
