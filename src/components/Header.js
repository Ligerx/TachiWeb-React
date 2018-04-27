import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import FilterButton from 'components/FilterButton';
import MoreButton from 'components/MoreButton';
import RefreshButton from 'components/RefreshButton';

// Every header is different? This is only for the Library header
const Header = () => (
  <AppBar color="default">
    <Toolbar>
      <IconButton>
        <Icon>menu</Icon>
      </IconButton>

      <Typography variant="title" style={{ flex: 1 }}>
        Library
      </Typography>

      <FilterButton />

      <Tooltip title="Search">
        <IconButton>
          <Icon>search</Icon>
        </IconButton>
      </Tooltip>

      <RefreshButton />

      <MoreButton />
    </Toolbar>
  </AppBar>
);

export default Header;
