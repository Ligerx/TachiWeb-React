// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { selectCurrentCategoryId } from "redux-ducks/categories";
import { changeCurrentCategoryId } from "redux-ducks/categories/actionCreators";
import { useCategories } from "apiHooks";
import type { CategoryType } from "types";

const CategoriesTabs = () => {
  const dispatch = useDispatch();

  const currentCategoryId = useSelector(selectCurrentCategoryId);

  const { data: categoriesWithDefault } = useCategories();
  const categories = removeEmptyDefaultCategory(categoriesWithDefault);

  const handleTabChange = (event: SyntheticEvent<>, newCategoryId) => {
    dispatch(changeCurrentCategoryId(newCategoryId));
  };

  if (categories == null || categories.length === 0) return null;

  return (
    <Tabs
      value={currentCategoryId}
      onChange={handleTabChange}
      indicatorColor="primary"
      variant="scrollable"
    >
      {categories.map(category => (
        <Tab key={category.id} label={category.name} value={category.id} />
      ))}
    </Tabs>
  );
};

function removeEmptyDefaultCategory(
  categories: ?(CategoryType[])
): ?(CategoryType[]) {
  if (categories == null) return categories;

  const defaultCategory = categories.find(category => category.id === -1);

  if (defaultCategory != null && defaultCategory.manga.length === 0) {
    return categories.filter(category => category.id !== -1);
  }

  return categories;
}

export default CategoriesTabs;
