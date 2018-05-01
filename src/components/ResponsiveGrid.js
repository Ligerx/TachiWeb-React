import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

// Responsive Grid, when the window is larger than a threshhold, constrain a max width on content
// based on this example
// https://stackoverflow.com/questions/49251454/grid-container-like-bootstrap-container

// TODO: Adjust maxWidth breakpoint to be something reasonable
// TODO: Make sure maxWidth transitions smoothly between breakpoints

// note - Material-UI does some weird things with margin which
//        1. create horizontal scroll that I want to get rid of
//        2. have an effect on the calculation of the correct maxWidth

const styles = (theme) => {
  const breakPointPx = 960;
  const padding = 16;
  const maxWidth = breakPointPx - padding;

  return {
    responsive: {
      [theme.breakpoints.up('md')]: {
        maxWidth,
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: padding,
        paddingRight: padding,
      },
    },
  };
};

const ResponsiveGrid = ({ classes, children }) => (
  <Grid container justify="center">
    {/* Top level Grid centers the child Grid */}
    <Grid container className={classes.responsive} spacing={16}>
      {children}
    </Grid>
  </Grid>
);

ResponsiveGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withStyles(styles)(ResponsiveGrid);