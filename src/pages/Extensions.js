// @flow
import React, { useEffect } from "react";
import FullScreenLoading from "components/loading/FullScreenLoading";
import type { ExtensionsContainerProps } from "containers/ExtensionsContainer";
import { Helmet } from "react-helmet";
import ResponsiveGrid from "components/ResponsiveGrid";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import { withStyles } from "@material-ui/core/styles";
import ExtensionListItem from "components/extensions/ExtensionListItem";
import Typography from "@material-ui/core/Typography";
import ExtensionButton from "components/extensions/ExtensionButton";

// Currently, the buttons that appear do not completely match Tachiyomi's buttons.
// Partially because I'm missing extension preferences,
// but also because I don't think it's worth the effort to implement.

const styles = () => ({
  avatar: { borderRadius: 0 },
  secondary: { right: 24 }
});

const Extensions = ({
  extensions,
  extensionsIsLoading,
  fetchExtensions,
  installExtension
}: ExtensionsContainerProps & { classes: Object }) => {
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

      <ResponsiveGrid maxWidth="xs">
        {installedExtensions.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="headline" gutterBottom>
              Installed ({installedExtensions.length})
            </Typography>
            <Paper>
              <List>
                {installedExtensions.map(extension => (
                  <ExtensionListItem
                    key={extension.pkg_name}
                    extension={extension}
                  >
                    <ExtensionButton
                      status={extension.status}
                      has_update={extension.has_update}
                      name={extension.name}
                      onUpdateClick={() => {}}
                      onUninstallClick={() => {}}
                      onInstallClick={() =>
                        installExtension(extension.pkg_name)
                      }
                    />
                  </ExtensionListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {notInstalledExtensions.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="headline" gutterBottom>
              Available ({notInstalledExtensions.length})
            </Typography>

            <Paper>
              <List>
                {notInstalledExtensions.map(extension => (
                  <ExtensionListItem
                    key={extension.pkg_name}
                    extension={extension}
                  >
                    <ExtensionButton
                      status={extension.status}
                      has_update={extension.has_update}
                      name={extension.name}
                      onUpdateClick={() => {}}
                      onUninstallClick={() => {}}
                      onInstallClick={() =>
                        installExtension(extension.pkg_name)
                      }
                    />
                  </ExtensionListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </ResponsiveGrid>

      {extensionsIsLoading && <FullScreenLoading />}
    </React.Fragment>
  );
};

export default withStyles(styles)(Extensions);
