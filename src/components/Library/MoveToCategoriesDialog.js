// @flow
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { selectCategories } from "redux-ducks/categories";
import { updateMultipleCategoryManga } from "redux-ducks/categories/actionCreators";

type Props = {
  mangaIds: Array<number>,
  open: boolean,
  onClose: Function
};

const useStyles = makeStyles({
  row: { display: "block" }
});

const MoveToCategoriesDialog = ({ mangaIds, open, onClose }: Props) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const categories = useSelector(selectCategories);

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
    const categoryIds = categories.map(category => category.id);
    const categorySelections = zipObject(categoryIds, selectedCategoriesList);

    dispatch(updateMultipleCategoryManga(categorySelections, mangaIds));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Move to categories</DialogTitle>
      <DialogContent>
        {categories.map((category, index) => (
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
        <Button onClick={onClose} color="primary" autoFocus>
          Go Back
        </Button>
        <Button onClick={handleMoveCategoryManga} color="primary">
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function deriveState(
  categories: Array<CategoryType>,
  mangaIds: Array<number>
): Array<boolean> {
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
