// @flow
import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuDrawer from "components/MenuDrawer";
import ResponsiveGrid from "components/ResponsiveGrid";
import Grid from "@material-ui/core/Grid";
import BackupCard from "components/backup-restore/BackupCard";
import RestoreCard from "components/backup-restore/RestoreCard";
import { Helmet } from "react-helmet";

const BackupRestore = () => (
  <React.Fragment>
    <Helmet>
      <title>Backup and Restore - TachiWeb</title>
    </Helmet>

    <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
      <Toolbar>
        <MenuDrawer />
        <Typography variant="h6">Backup / Restore</Typography>
      </Toolbar>
    </AppBar>

    <ResponsiveGrid maxWidth="xs">
      <Grid item xs={12}>
        <BackupCard />
      </Grid>

      <Grid item xs={12}>
        <RestoreCard />
      </Grid>
    </ResponsiveGrid>
  </React.Fragment>
);

export default BackupRestore;
