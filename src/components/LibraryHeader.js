// @flow
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterButton from 'components/FilterButton';
import MoreButton from 'components/MoreButton';
import RefreshButton from 'components/RefreshButton';
import SearchButton from 'components/SearchButton';
import MenuDrawer from 'components/MenuDrawer';

type Props = { onRefreshClick: Function };

// Every header is different? This is only for the Library header
const LibraryHeader = ({ onRefreshClick }: Props) => (
  <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
    <Toolbar>
      <MenuDrawer />

      <Typography variant="title" style={{ flex: 1 }}>
        Library
      </Typography>

      <FilterButton />

      <SearchButton />

      <RefreshButton onClick={onRefreshClick} />

      <MoreButton />
    </Toolbar>
  </AppBar>
);

export default LibraryHeader;
