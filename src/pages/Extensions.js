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

// Currently, the buttons that appear do not completely match Tachiyomi's buttons.
// Partially because I'm missing extension preferences,
// but also because I don't think it's worth the effort to implement.

const Extensions = ({
  extensions,
  extensionsIsLoading,
  fetchExtensions,
  installExtension,
  uninstallExtension,
  reloadExtensions
}: ExtensionsContainerProps) => {
  useEffect(() => {
    fetchExtensions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const installedExtensions = extensions.filter(
    extension => extension.status === "INSTALLED"
  );

  const notInstalledExtensions = extensions.filter(
    extension => extension.status !== "INSTALLED"
  );

  return (
    <React.Fragment>
      <Helmet title="Extensions - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <MenuDrawer />

          <Typography variant="title" style={{ flex: 1 }}>
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

      {extensionsIsLoading && <FullScreenLoading />}
    </React.Fragment>
  );
};

export default Extensions;
