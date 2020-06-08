// @flow
import React, { memo } from "react";
import List from "@material-ui/core/List";
import EditCategoriesListItem from "components/Library/EditCategoriesListItem";
import { useCategories } from "apiHooks";

const EditCategoriesList = memo<{}>(() => {
  const { data: categoriesWithDefault } = useCategories();
  const categories = categoriesWithDefault.filter(
    category => category.id !== -1
  );

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
