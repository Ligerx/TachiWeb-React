import React from 'react';
import List, { ListItem, ListItemText } from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Client } from 'api';

// Set the width of the menu
const classes = {
  list: {
    width: 250,
  },
};

const MenuList = props => (
  <div className={props.classes.list}>
    <List>
      <ListItem>
        <Typography variant="title" gutterBottom>
          TachiWeb
        </Typography>
      </ListItem>
      <ListItem button component={Link} to={Client.library()}>
        <ListItemText primary="Library" />
      </ListItem>
      <ListItem button component={Link} to={Client.catalogue()}>
        <ListItemText primary="Catalogue" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Downloads" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Settings" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Backup/Restore" />
      </ListItem>
    </List>
  </div>
);

MenuList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(classes)(MenuList);
