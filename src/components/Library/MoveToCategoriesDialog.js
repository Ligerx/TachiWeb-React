// @flow
import React, { useState, useEffect, useMemo } from "react";
import zipObject from "lodash/zipObject";
import type { CategoryType } from "types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useCategories, useUpdateMangasInCategories } from "apiHooks";

type Props = {
  mangaIds: Array<number>,
  open: boolean,
  onClose: Function,
  onMove: Function
};

const useStyles = makeStyles({
  row: { display: "block" }
});

const MoveToCategoriesDialog = ({ mangaIds, open, onClose, onMove }: Props) => {
  const classes = useStyles();

  const { data: categoriesWithDefault } = useCategories();

  // Ignoring default category for this component. Using useMemo so that shallow equality is preserved between renders.
  // This helps useEffect fire on deps change as expected instead of on every render.
  const categories = useMemo(() => {
    if (categoriesWithDefault == null) return categoriesWithDefault;
    return categoriesWithDefault.filter(category => category.id !== -1);
  }, [categoriesWithDefault]);

  const updateMangasInCategories = useUpdateMangasInCategories();

  // Array of booleans that tracks if a checkbox is selected. This is ordered 1:1 with categories.
  const [selectedCategoriesList, setSelectedCategoriesList] = useState<
    Array<boolean>
  >(() => {
    // Lazyily initializing state as a tiny optimization. This function was getting called
    // multiple times every time props changed even though it should only be called once.
    return deriveState(categories, mangaIds);
  });

  useEffect(() => {
    setSelectedCategoriesList(deriveState(categories, mangaIds));
  }, [categories, mangaIds]);

  const handleToggleCategory = (index: number) => {
    const stateCopy = selectedCategoriesList.slice();
    stateCopy[index] = !stateCopy[index];

    setSelectedCategoriesList(stateCopy);
  };

  const handleMoveCategoryManga = () => {
    if (categories == null) return;

    const categoryIds = categories.map(category => category.id);
    const categorySelections = zipObject(categoryIds, selectedCategoriesList);

    updateMangasInCategories(categorySelections, mangaIds);
    onClose();
    onMove();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Move to categories</DialogTitle>
      <DialogContent>
        {categories != null &&
          categories.map((category, index) => (
            <FormControlLabel
              key={category.id}
              className={classes.row}
              control={
                <Checkbox
                  checked={selectedCategoriesList[index]}
                  onChange={() => handleToggleCategory(index)}
                />
              }
              label={category.name}
            />
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleMoveCategoryManga} color="primary">
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function deriveState(
  categories: ?(CategoryType[]),
  mangaIds: Array<number>
): Array<boolean> {
  if (categories == null) return [];

  const state = categories.map(category => {
    let selected = false;

    const containsAllMangaId = mangaIds.every(mangaId =>
      category.manga.includes(mangaId)
    );

    if (category.manga.length > 0 && containsAllMangaId) {
      selected = true;
    }

    return selected;
  });

  return state;
}

export default MoveToCategoriesDialog;
