// @flow
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LibraryMore from "components/Library/LibraryMore";
import RefreshButton from "components/RefreshButton";
import LibrarySearch from "components/Library/LibrarySearch";
import MenuDrawer from "components/MenuDrawer";
import LibraryFilter from "components/Library/LibraryFilter";
import LibrarySort from "components/Library/LibrarySort";
import { useLibraryFlags, useUpdateLibrary, useSetLibraryFlag } from "apiHooks";

type Props = {
  searchQuery: string,
  onSearchChange: Function
};

const LibraryDefaultToolbar = ({ searchQuery, onSearchChange }: Props) => {
  const { data: libraryFlags } = useLibraryFlags();

  const updateLibrary = useUpdateLibrary();
  const setLibraryFlag = useSetLibraryFlag();

  const handleRefreshClick = () => {
    updateLibrary();
  };

  const handleSetLibraryFlag = (flag, state) => {
    setLibraryFlag(libraryFlags, flag, state);
  };

  if (libraryFlags == null) return null;

  return (
    <Toolbar>
      <MenuDrawer />

      <Typography variant="h6" noWrap style={{ flex: 1 }}>
        Library
      </Typography>

      <LibrarySearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <RefreshButton onClick={handleRefreshClick} />

      <LibraryFilter
        flags={libraryFlags}
        setLibraryFlag={handleSetLibraryFlag}
      />

      <LibrarySort flags={libraryFlags} setLibraryFlag={handleSetLibraryFlag} />

      <LibraryMore />
    </Toolbar>
  );
};

export default LibraryDefaultToolbar;
