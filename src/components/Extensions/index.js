// @flow
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import Container from "@material-ui/core/Container";
import MenuDrawer from "components/MenuDrawer";
import RefreshButton from "components/RefreshButton";
import ExtensionList from "components/Extensions/ExtensionList";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsExtensionsLoading,
  selectInstalledExtensions,
  selectNotInstalledExtensions
} from "redux-ducks/extensions";
import {
  fetchExtensions,
  reloadExtensions
} from "redux-ducks/extensions/actionCreators";

// Currently, the buttons that appear do not completely match Tachiyomi's buttons.
// Partially because I'm missing extension preferences,
// but also because I don't think it's worth the effort to implement.

const useStyles = makeStyles({
  list: {
    marginBottom: 32
  }
});

const Extensions = () => {
  const installedExtensions = useSelector(selectInstalledExtensions);
  const notInstalledExtensions = useSelector(selectNotInstalledExtensions);
  const isExtensionsLoading = useSelector(selectIsExtensionsLoading);

  const dispatch = useDispatch();

  const handleReloadExtensions = () => dispatch(reloadExtensions());

  useEffect(() => {
    dispatch(fetchExtensions());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = useStyles();

  return (
    <>
      <Helmet title="Extensions - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <MenuDrawer />

          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            Extensions
          </Typography>

          <RefreshButton onClick={handleReloadExtensions} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <ExtensionList
          title="Installed"
          extensions={installedExtensions}
          className={classes.list}
        />
        <ExtensionList
          title="Available"
          extensions={notInstalledExtensions}
          className={classes.list}
        />
      </Container>

      {isExtensionsLoading && <FullScreenLoading />}
    </>
  );
};

export default Extensions;
