// @flow
import React, { memo } from "react";
import List from "@material-ui/core/List";
import EditCategoriesListItem from "components/Library/EditCategoriesListItem";
import type { CategoryType } from "types";

type Props = { categories: CategoryType[] };

const EditCategoriesList = memo<Props>(({ categories }: Props) => {
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
