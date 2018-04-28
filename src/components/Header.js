import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import FilterButton from 'components/FilterButton';
import MoreButton from 'components/MoreButton';
import RefreshButton from 'components/RefreshButton';
import SearchButton from 'components/SearchButton';
import MenuDrawer from 'components/MenuDrawer';

// Every header is different? This is only for the Library header
const Header = () => (
  <AppBar color="default">
    <Toolbar>
      <MenuDrawer />

      <Typography variant="title" style={{ flex: 1 }}>
        Library
      </Typography>

      <FilterButton />

      <SearchButton />

      <RefreshButton />

      <MoreButton />
    </Toolbar>
  </AppBar>
);

export default Header;
