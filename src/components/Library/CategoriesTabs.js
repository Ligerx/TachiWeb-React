// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { selectCurrentCategoryId } from "redux-ducks/categories";
import { changeCurrentCategoryId } from "redux-ducks/categories/actionCreators";
import { useCategories, useLibrary } from "apiHooks";
import { defaultCategoryMangaIds } from "components/utils";

const CategoriesTabs = () => {
  const dispatch = useDispatch();

  const { data: categories } = useCategories();
  const { data: libraryMangas } = useLibrary();

  const currentCategoryId = useSelector(selectCurrentCategoryId);

  const defaultCategoryHasManga =
    defaultCategoryMangaIds(
      categories,
      libraryMangas.map(libraryManga => libraryManga.manga.id)
    ).length > 0;

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
      {defaultCategoryHasManga ? <Tab label="Default" value={null} /> : null}

      {categories.map(category => (
        <Tab key={category.id} label={category.name} value={category.id} />
      ))}
    </Tabs>
  );
};

export default CategoriesTabs;
