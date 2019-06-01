// @flow
import React, { useEffect } from "react";
import FullScreenLoading from "components/loading/FullScreenLoading";
import type { ExtensionsContainerProps } from "containers/ExtensionsContainer";
import { Helmet } from "react-helmet";
import ResponsiveGrid from "components/ResponsiveGrid";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuDrawer from "components/MenuDrawer";
import RefreshButton from "components/RefreshButton";
import ExtensionList from "components/extensions/ExtensionList";
import type { ExtensionType } from "types";

// Currently, the buttons that appear do not completely match Tachiyomi's buttons.
// Partially because I'm missing extension preferences,
// but also because I don't think it's worth the effort to implement.

const Extensions = ({
  extensions,
  isExtensionsLoading,
  fetchExtensions,
  installExtension,
  uninstallExtension,
  reloadExtensions
}: ExtensionsContainerProps) => {
  useEffect(() => {
    fetchExtensions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const installedExtensions = extensions
    .filter(extension => extension.status === "INSTALLED")
    .sort(extensionSort);

  const notInstalledExtensions = extensions
    .filter(extension => extension.status !== "INSTALLED")
    .sort(extensionSort);

  return (
    <React.Fragment>
      <Helmet title="Extensions - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <MenuDrawer />

          <Typography variant="h6" style={{ flex: 1 }}>
            Extensions
          </Typography>

          <RefreshButton onClick={() => reloadExtensions()} />
        </Toolbar>
      </AppBar>

      <ResponsiveGrid maxWidth="xs">
        <ExtensionList
          title="Installed"
          extensions={installedExtensions}
          onUpdateClick={installExtension}
          onInstallClick={installExtension}
          onUninstallClick={uninstallExtension}
        />

        <ExtensionList
          title="Available"
          extensions={notInstalledExtensions}
          onUpdateClick={installExtension}
          onInstallClick={installExtension}
          onUninstallClick={uninstallExtension}
        />
      </ResponsiveGrid>

      {isExtensionsLoading && <FullScreenLoading />}
    </React.Fragment>
  );
};

export default Extensions;
