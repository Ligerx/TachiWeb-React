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
import { useDispatch } from "react-redux";
import { fetchExtensions } from "redux-ducks/extensions/actionCreators";
import { useExtensions, useReloadExtensions } from "apiHooks";
import partition from "lodash/partition";
import type { ExtensionType } from "types";

// Currently, the buttons that appear do not completely match Tachiyomi's buttons.
// Partially because I'm missing extension preferences,
// but also because I don't think it's worth the effort to implement.

const useStyles = makeStyles({
  list: {
    marginBottom: 32
  }
});

const Extensions = () => {
  const dispatch = useDispatch();

  const { data: extensions } = useExtensions();
  const [
    installedExtensions,
    notInstalledExtensions
  ] = sortAndPartitionExtensions(extensions);

  const reloadExtensions = useReloadExtensions();

  const handleReloadExtensions = () => reloadExtensions();

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

      {extensions == null && <FullScreenLoading />}
    </>
  );
};

/**
 * @returns an array 2 sorted extension arrays. The first contains installed extensions, the second includes not installed extensions.
 */
function sortAndPartitionExtensions(
  extensions: ExtensionType[] | null
): [ExtensionType[], ExtensionType[]] {
  if (extensions == null) return [[], []];

  const sortedExtensions = extensions.sort(extensionSort);
  return partition(
    sortedExtensions,
    extension => extension.status === "INSTALLED"
  );
}

function extensionSort(a: ExtensionType, b: ExtensionType) {
  // First sort alphabetically by language
  // Not using the pretty print / native name, but it gets the job done
  if (a.lang > b.lang) return 1;
  if (a.lang < b.lang) return -1;

  // Then sort alphabetically by source name
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;

  return 0;
}

export default Extensions;
