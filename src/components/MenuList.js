// @flow
import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "components/Link";
import { Client } from "api";

// Set the width of the menu
const useStyles = makeStyles({
  list: {
    width: 250
  }
});

const MenuList = () => {
  const classes = useStyles();

  return (
    <div className={classes.list}>
      <List>
        <ListItem>
          <Typography variant="h6" gutterBottom>
            TachiWeb
          </Typography>
        </ListItem>
        <ListItem button component={Link} to={Client.library()}>
          <ListItemText primary="Library" />
        </ListItem>
        <ListItem button component={Link} to={Client.catalogues()}>
          <ListItemText primary="Catalogues" />
        </ListItem>
        <ListItem button component={Link} to={Client.extensions()}>
          <ListItemText primary="Extensions" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Downloads" />
        </ListItem>
        <ListItem button component={Link} to={Client.settings()}>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button component={Link} to={Client.backupRestore()}>
          <ListItemText primary="Backup / Restore" />
        </ListItem>
      </List>
    </div>
  );
};

export default MenuList;
