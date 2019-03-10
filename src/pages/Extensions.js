// @flow
import React, { useEffect } from "react";
import FullScreenLoading from "components/loading/FullScreenLoading";
import type { ExtensionsContainerProps } from "containers/ExtensionsContainer";
import { Helmet } from "react-helmet";
import ResponsiveGrid from "components/ResponsiveGrid";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { Server } from "api";
import { withStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Button from "@material-ui/core/Button";
import ISO6391 from "iso-639-1";

const styles = () => ({
  avatar: { borderRadius: 0 },
  secondary: { right: 24 }
});

const Extensions = ({
  classes,
  extensions,
  extensionsIsLoading,
  fetchExtensions
}: ExtensionsContainerProps & { classes: Object }) => {
  useEffect(() => {
    fetchExtensions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <Helmet title="Extensions - TachiWeb" />

      <ResponsiveGrid maxWidth="xs">
        <Grid item xs={12}>
          <Paper>
            <List>
              {extensions.map(extension => (
                <ListItem divider key={extension.pkg_name}>
                  <Avatar
                    className={classes.avatar}
                    src={Server.extensionIcon(extension.pkg_name)}
                  />
                  <ListItemText
                    primary={extension.name}
                    secondary={`${langPrettyPrint(extension.lang)} - v${
                      extension.version_name
                    }`}
                  />
                  <ListItemSecondaryAction className={classes.secondary}>
                    <Button
                      variant={buttonVariant(extension.has_update)}
                      color="primary"
                    >
                      Install
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </ResponsiveGrid>

      {extensionsIsLoading && <FullScreenLoading />}
    </React.Fragment>
  );
};

// Helper functions
function buttonVariant(has_update: ?boolean) {
  return has_update ? "contained" : "outlined";
}

function langPrettyPrint(lang: string) {
  if (lang === "all") return "All";
  return ISO6391.getName(lang);
}

export default withStyles(styles)(Extensions);
