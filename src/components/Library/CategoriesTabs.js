// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  selectCategories,
  selectCurrentCategoryId,
  selectDefaultCategoryHasManga
} from "redux-ducks/categories";
import { changeCurrentCategoryId } from "redux-ducks/categories/actionCreators";

const CategoriesTabs = () => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  const defaultCategoryHasManga = useSelector(selectDefaultCategoryHasManga);

  const handleTabChange = (event: SyntheticEvent<>, newCategoryId) => {
    dispatch(changeCurrentCategoryId(newCategoryId));
  };

  if (categories.length === 0) return null;

  return (
    <Tabs
      value={currentCategoryId}
      onChange={handleTabChange}
      indicatorColor="primary"
      centered
    >
      {defaultCategoryHasManga ? <Tab label="Default" value={null} /> : null}

      {categories.map(category => (
        <Tab key={category.id} label={category.name} value={category.id} />
      ))}
    </Tabs>
  );
};

export default CategoriesTabs;
