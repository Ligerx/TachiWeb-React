import React from 'react';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';

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
      <ListItem button>
        <ListItemText primary="Library" />
      </ListItem>
      <ListItem button>
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

// prop validation for Material-UI styles is slightly odd, but this is correct
MenuList.propTypes = {
  classes: PropTypes.shape({
    list: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(classes)(MenuList);
