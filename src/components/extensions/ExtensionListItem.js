// @flow
/* eslint-disable camelcase */
import * as React from "react";
import type { ExtensionType } from "types";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { Server } from "api";
import { withStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ISO6391 from "iso-639-1";

const styles = () => ({
  avatar: { borderRadius: 0 },
  secondary: { right: 24 }
});

type Props = {
  classes: Object,
  extension: ExtensionType,
  children: React.Node
};

const ExtensionListItem = ({ classes, extension, children }: Props) => {
  const { pkg_name, name, lang, version_name } = extension;

  return (
    <ListItem divider>
      <Avatar className={classes.avatar} src={Server.extensionIcon(pkg_name)} />
      <ListItemText
        primary={name}
        secondary={`${langPrettyPrint(lang)} - v${version_name}`}
      />
      <ListItemSecondaryAction className={classes.secondary}>
        {children}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// Helper functions
function langPrettyPrint(lang: string) {
  if (lang === "all") return "All";
  return ISO6391.getNativeName(lang);
}

export default withStyles(styles)(ExtensionListItem);
