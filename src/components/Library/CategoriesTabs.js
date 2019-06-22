// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  selectCategories,
  selectCategoryCurrentTab
} from "redux-ducks/categories";
import { changeTab } from "redux-ducks/categories/actionCreators";

const CategoriesTabs = () => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const tabValue = useSelector(selectCategoryCurrentTab);

  const handleTabChange = (event: SyntheticEvent<>, newTabValue) => {
    dispatch(changeTab(newTabValue));
  };

  if (categories.length === 0) return null;

  return (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      indicatorColor="primary"
      centered
    >
      <Tab label="Default" />

      {categories.map(category => (
        <Tab label={category.name} />
      ))}
    </Tabs>
  );
};

export default CategoriesTabs;
