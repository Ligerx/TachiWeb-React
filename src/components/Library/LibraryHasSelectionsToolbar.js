// @flow
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import UnfavoriteMultipleMangaDialog from "components/Library/UnfavoriteMultipleMangaDialog";
import MoveToCategoriesDialog from "components/Library/MoveToCategoriesDialog";
import { unfavoriteMultiple } from "redux-ducks/mangaInfos/actionCreators";

type Props = {
  selectedMangaIds: Array<number>,
  deselectMangaIds: Function
};

const LibraryHasSelectionsToolbar = ({
  selectedMangaIds,
  deselectMangaIds
}: Props) => {
  const dispatch = useDispatch();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [
    isMoveToCategoriesDialogOpen,
    setMoveToCategoriesDialogOpen
  ] = useState(false);

  const handleBackClick = () => {
    deselectMangaIds();
  };

  const handleEditCategoriesClick = () => {
    setMoveToCategoriesDialogOpen(true);
  };

  const handleMoveToCategories = () => {
    deselectMangaIds();
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleUnfavoriteManga = () => {
    dispatch(unfavoriteMultiple(selectedMangaIds));
    deselectMangaIds();
  };

  return (
    <>
      <Toolbar>
        <IconButton onClick={handleBackClick}>
          <Icon>arrow_back</Icon>
        </IconButton>

        <Typography variant="h6" noWrap style={{ flex: 1 }}>
          Selected: {selectedMangaIds.length}
        </Typography>

        {/* TODO: implement changing manga cover image */}
        {selectedMangaIds.length === 1 && (
          <IconButton onClick={() => {}}>
            <Icon>edit</Icon>
          </IconButton>
        )}

        <IconButton onClick={handleEditCategoriesClick}>
          <Icon>label</Icon>
        </IconButton>

        <IconButton onClick={handleDeleteClick}>
          <Icon>delete</Icon>
        </IconButton>
      </Toolbar>

      <MoveToCategoriesDialog
        mangaIds={selectedMangaIds}
        open={isMoveToCategoriesDialogOpen}
        onClose={() => setMoveToCategoriesDialogOpen(false)}
        onMove={handleMoveToCategories}
      />

      <UnfavoriteMultipleMangaDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleUnfavoriteManga}
      />
    </>
  );
};

export default LibraryHasSelectionsToolbar;
