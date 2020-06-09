// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { selectCurrentCategoryId } from "redux-ducks/categories";
import { changeCurrentCategoryId } from "redux-ducks/categories/actionCreators";
import { useCategories } from "apiHooks";

const CategoriesTabs = () => {
  const dispatch = useDispatch();

  const currentCategoryId = useSelector(selectCurrentCategoryId);

  const { data: categories } = useCategories({
    includeDefault: "IF_NOT_EMPTY"
  });

  const handleTabChange = (event: SyntheticEvent<>, newCategoryId) => {
    dispatch(changeCurrentCategoryId(newCategoryId));
  };

  if (categories == null || categories.length === 0) return null;
  if (categories.length === 1 && categories[0].id === -1) return null;

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

export default CategoriesTabs;
