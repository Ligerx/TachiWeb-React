// @flow
/* eslint-disable camelcase */
import React from "react";
import type { ExtensionType } from "types";
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

type Props = {
  classes: Object,
  extension: ExtensionType
  // onUpdateClick: Function,
  // onUninstallClick: Function,
  // onInstallClick: Function,
};

const ExtensionListItem = ({ classes, extension }: Props) => {
  const { pkg_name, name, lang, version_name, has_update, status } = extension;

  return (
    <ListItem divider>
      <Avatar className={classes.avatar} src={Server.extensionIcon(pkg_name)} />
      <ListItemText
        primary={name}
        secondary={`${langPrettyPrint(lang)} - v${version_name}`}
      />
      <ListItemSecondaryAction className={classes.secondary}>
        <Button variant={buttonVariant(has_update)} color="primary">
          {buttonText(status, has_update)}
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// Helper functions
function buttonVariant(has_update: ?boolean) {
  return has_update ? "contained" : "outlined";
}

function langPrettyPrint(lang: string) {
  if (lang === "all") return "All";
  return ISO6391.getNativeName(lang);
}

function buttonText(status: string, has_update: ?boolean) {
  if (status === "INSTALLED" && has_update) {
    return "Update";
  }
  if (status === "INSTALLED") {
    return "Uninstall";
  }
  if (status === "AVAILABLE") {
    return "Install";
  }
  return "Untrusted";
}

export default withStyles(styles)(ExtensionListItem);
