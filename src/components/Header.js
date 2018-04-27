import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';

// Every header is different? This is only for the Library header
class Header extends Component {
  render() {
    return (
      <AppBar color="default">
        <Toolbar>
          <IconButton>
            <Icon>menu</Icon>
          </IconButton>

          <Typography variant="title" style={{ flex: 1 }}>
            Library
          </Typography>

          <Tooltip title="Filter">
            <IconButton>
              <Icon>filter_list</Icon>
            </IconButton>
          </Tooltip>

          <Tooltip title="Search">
            <IconButton>
              <Icon>search</Icon>
            </IconButton>
          </Tooltip>

          <Tooltip title="Refresh">
            <IconButton>
              <Icon>refresh</Icon>
            </IconButton>
          </Tooltip>

          <IconButton>
            <Icon>more_vert</Icon>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
