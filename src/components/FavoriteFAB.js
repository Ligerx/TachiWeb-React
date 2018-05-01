import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';

// TODO: split this into two components, FAB and FavoriteFAB

// FAB button position based on this link
// https://stackoverflow.com/questions/37760448/how-to-make-floating-action-button-content-overlap-two-divs-in-materializecss

// NOTE: parent must be [position: relative] for this to position correctly.
// for example:
// const styles = () => ({
//   fabParent: {
//     position: 'relative',
//   },
// });

const styles = () => ({
  fab: {
    position: 'absolute',
    bottom: 0,
    right: '5%',
    marginBottom: -28,
  },
});

const FavoriteFAB = ({ classes }) => (
  <Button variant="fab" color="primary" className={classes.fab}>
    <IconButton>
      <Icon>bookmark_border</Icon>
      {/* also <Icon>bookmark</Icon> */}
    </IconButton>
  </Button>
);

export default withStyles(styles)(FavoriteFAB);
