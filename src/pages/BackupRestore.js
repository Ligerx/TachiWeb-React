// @flow
import React, { Component } from 'react';
import FullScreenLoading from 'components/loading/FullScreenLoading';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuDrawer from 'components/MenuDrawer';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { Server } from 'api';
import ResponsiveGrid from 'components/ResponsiveGrid';
import { Grid } from '@material-ui/core';

// TODO: Use a very small max width for the responsive grid in this page
//       will require updating ResponsiveGrid's code

class BackupRestore extends Component {
  state = {
    test: true,
  };

  render() {
    return (
      <React.Fragment>
        <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
          <Toolbar>
            <MenuDrawer />
            <Typography variant="title">Backup / Restore</Typography>
          </Toolbar>
        </AppBar>

        <ResponsiveGrid>
          <Grid item xs={12}>
            <Paper>
              <Button variant="raised" color="primary" href={Server.backupDownload()} download>
                <Icon>cloud_download</Icon>
                Backup
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Button variant="raised" color="primary">
                <Icon>cloud_upload</Icon>
                Restore
              </Button>
            </Paper>
          </Grid>
        </ResponsiveGrid>
      </React.Fragment>
    );
  }
}

export default BackupRestore;
