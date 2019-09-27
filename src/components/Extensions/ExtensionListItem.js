// @flow
/* eslint-disable camelcase */
import * as React from "react";
import type { ExtensionType } from "types";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { Server } from "api";
import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { langPrettyPrint } from "components/utils";

const useStyles = makeStyles({
  avatar: { borderRadius: 0 },
  secondary: { right: 24 }
});

type Props = {
  extension: ExtensionType,
  divider: boolean,
  children: React.Node
};

const ExtensionListItem = ({ extension, divider, children }: Props) => {
  const { pkg_name, name, lang, version_name } = extension;

  const classes = useStyles();

  return (
    <ListItem divider={divider}>
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

export default ExtensionListItem;
