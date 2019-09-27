// @flow
import React from "react";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import MenuDrawer from "components/MenuDrawer";
import BackupCard from "components/BackupRestore/BackupCard";
import RestoreCard from "components/BackupRestore/RestoreCard";

const useStyles = makeStyles({
  card: {
    marginBottom: 16
  }
});

const BackupRestore = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet title="Backup and Restore - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <MenuDrawer />
          <Typography variant="h6">Backup / Restore</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <BackupCard className={classes.card} />
        <RestoreCard className={classes.card} />
      </Container>
    </>
  );
};

export default BackupRestore;
