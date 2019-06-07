// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LibraryMore from "components/Library/LibraryMore";
import RefreshButton from "components/RefreshButton";
import LibrarySearch from "components/Library/LibrarySearch";
import MenuDrawer from "components/MenuDrawer";
import LibraryFilter from "components/Library/LibraryFilter";
import LibrarySort from "components/Library/LibrarySort";
import {
  selectLibraryFlags,
  setLibraryFlag,
  updateLibrary
} from "redux-ducks/library";

type Props = {
  searchQuery: string,
  onSearchChange: Function
};

const LibraryHeader = ({ searchQuery, onSearchChange }: Props) => {
  const dispatch = useDispatch();

  const flags = useSelector(selectLibraryFlags);

  const handleRefreshClick = () => {
    dispatch(updateLibrary());
  };

  const handleSetLibraryFlag = (flag, state) =>
    dispatch(setLibraryFlag(flag, state));

  return (
    <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
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
    </AppBar>
  );
};

export default LibraryHeader;
