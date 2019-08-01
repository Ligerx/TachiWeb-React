// @flow
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CategoryType } from "types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { selectCategories } from "redux-ducks/categories";

type Props = {
  mangaIds: Array<number>,
  open: boolean,
  onClose: Function,
  onDelete: Function
};

type StateElement = {
  id: number,
  name: string,
  selected: boolean
};

const MoveToCategoriesDialog = ({
  mangaIds,
  open,
  onClose,
  onDelete
}: Props) => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);

  // FIXME: This seems to be causing a lot of lag.
  // Need to do further investigation, but it seems like deriving the state is
  // a somewhat expensive operation. Additionally, I need to figure out when this component gets
  // mounted and rerendered/updated. I believe there's a bunch of unnecessary rerenders happening.
  const [selectedCategories, setSelectedCategories] = useState<
    Array<StateElement>
  >(deriveState(categories, mangaIds));

  useEffect(() => {
    setSelectedCategories(deriveState(categories, mangaIds));
  });

  // TODO: Implement the actual move logic

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Move to categories</DialogTitle>
      <DialogContent>
        {selectedCategories.map(category => (
          <FormControlLabel
            key={category.id}
            control={
              <Checkbox checked={category.selected} onChange={() => {}} />
            }
            label={category.name}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          Go Back
        </Button>
        <Button onClick={onDelete} color="primary">
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function deriveState(
  categories: Array<CategoryType>,
  mangaIds: Array<number>
): Array<StateElement> {
  const state = categories.map(category => {
    let selected = false;

    const containsAllMangaId = mangaIds.every(mangaId =>
      category.manga.includes(mangaId)
    );

    if (category.manga.length > 0 && containsAllMangaId) {
      selected = true;
    }

    return {
      id: category.id,
      name: category.name,
      selected
    };
  });
  return state;
}

export default MoveToCategoriesDialog;
