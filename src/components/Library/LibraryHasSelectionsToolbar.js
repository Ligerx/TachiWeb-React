// @flow
import * as React from "react";
import { useDispatch } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import { unfavoriteMultiple } from "redux-ducks/mangaInfos/actionCreators";

type Props = {
  selectedManga: Array<number>,
  setSelectedManga: Function
};

const LibraryHasSelectionsToolbar = ({
  selectedManga,
  setSelectedManga
}: Props) => {
  const dispatch = useDispatch();

  const handleBackClick = () => {
    setSelectedManga([]);
  };

  const handleEditCategoriesClick = () => {
    // TODO
    setSelectedManga([]);
  };

  const handleDeleteClick = () => {
    dispatch(unfavoriteMultiple(selectedManga));
    setSelectedManga([]);
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
      {selectedManga.length === 1 && (
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
