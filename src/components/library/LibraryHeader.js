// @flow
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LibraryMore from "components/library/LibraryMore";
import RefreshButton from "components/RefreshButton";
import LibrarySearch from "components/library/LibrarySearch";
import MenuDrawer from "components/MenuDrawer";
import LibraryFilter from "components/library/LibraryFilter";
import LibrarySort from "components/library/LibrarySort";
import type { LibraryFlagsType } from "types";

type Props = {
  flags: LibraryFlagsType,
  searchQuery: string,
  onSearchChange: Function,
  onRefreshClick: Function,
  setLibraryFlag: Function
};

const LibraryHeader = ({
  flags,
  searchQuery,
  onSearchChange,
  onRefreshClick,
  setLibraryFlag
}: Props) => (
  <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
    <Toolbar>
      <MenuDrawer />

      <Typography variant="title" style={{ flex: 1 }}>
        Library
      </Typography>

      <LibrarySearch
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <RefreshButton onClick={onRefreshClick} />

      <LibraryFilter flags={flags} setLibraryFlag={setLibraryFlag} />

      <LibrarySort flags={flags} setLibraryFlag={setLibraryFlag} />

      <LibraryMore />
    </Toolbar>
  </AppBar>
);

export default LibraryHeader;
