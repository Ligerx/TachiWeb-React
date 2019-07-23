// @flow
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import LibraryMore from "components/Library/LibraryMore";
import RefreshButton from "components/RefreshButton";
import LibrarySearch from "components/Library/LibrarySearch";
import MenuDrawer from "components/MenuDrawer";
import LibraryFilter from "components/Library/LibraryFilter";
import LibrarySort from "components/Library/LibrarySort";
import { selectLibraryFlags } from "redux-ducks/library";
import {
  setLibraryFlag,
  updateLibrary
} from "redux-ducks/library/actionCreators";

type Props = {
  searchQuery: string,
  onSearchChange: Function,
  selectedManga: Array<number>,
  setSelectedManga: Function,
  children: ?React.Node
};

type DefaultToolbarProps = {
  searchQuery: string,
  onSearchChange: Function
};

const DefaultToolbar = ({
  searchQuery,
  onSearchChange
}: DefaultToolbarProps) => {
  const dispatch = useDispatch();

  const flags = useSelector(selectLibraryFlags);

  const handleRefreshClick = () => {
    dispatch(updateLibrary());
  };

  const handleSetLibraryFlag = (flag, state) =>
    dispatch(setLibraryFlag(flag, state));

  return (
    <Toolbar>
      <MenuDrawer />

      <Typography variant="h6" style={{ flex: 1 }}>
        Library
      </Typography>

      <LibrarySearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <RefreshButton onClick={handleRefreshClick} />

      <LibraryFilter flags={flags} setLibraryFlag={handleSetLibraryFlag} />

      <LibrarySort flags={flags} setLibraryFlag={handleSetLibraryFlag} />

      <LibraryMore />
    </Toolbar>
  );
};

type HasSelectionsToolbarProps = {
  selectedManga: Array<number>,
  setSelectedManga: Function
};

const HasSelectionsToolbar = ({
  selectedManga,
  setSelectedManga
}: HasSelectionsToolbarProps) => {
  const dispatch = useDispatch();

  const handleBackClick = () => {
    setSelectedManga([]);
  };

  const handleEditCategoriesClick = () => {
    // TODO
    setSelectedManga([]);
  };

  const handleDeleteClick = () => {
    // TODO
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

const LibraryHeader = ({
  searchQuery,
  onSearchChange,
  selectedManga,
  setSelectedManga,
  children
}: Props) => {
  return (
    <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
      {selectedManga.length > 0 ? (
        <HasSelectionsToolbar
          selectedManga={selectedManga}
          setSelectedManga={setSelectedManga}
        />
      ) : (
        <DefaultToolbar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      )}
      {children}
    </AppBar>
  );
};

export default LibraryHeader;
