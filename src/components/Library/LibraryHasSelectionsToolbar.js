// @flow
import React from "react";
import { useDispatch } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import { unfavoriteMultiple } from "redux-ducks/mangaInfos/actionCreators";

type Props = {
  selectedMangaIds: Array<number>,
  setSelectedMangaIds: Function
};

const LibraryHasSelectionsToolbar = ({
  selectedMangaIds,
  setSelectedMangaIds
}: Props) => {
  const dispatch = useDispatch();

  const handleBackClick = () => {
    setSelectedMangaIds([]);
  };

  const handleEditCategoriesClick = () => {
    // TODO
    setSelectedMangaIds([]);
  };

  const handleDeleteClick = () => {
    dispatch(unfavoriteMultiple(selectedMangaIds));
    setSelectedMangaIds([]);
  };

  return (
    <Toolbar>
      <IconButton onClick={handleBackClick}>
        <Icon>arrow_back</Icon>
      </IconButton>

      <Typography variant="h6" style={{ flex: 1 }}>
        Selected: {null}
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
  );
};

export default LibraryHasSelectionsToolbar;
