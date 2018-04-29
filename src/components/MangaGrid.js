import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import MangaCard from 'components/MangaCard';
import { withStyles } from 'material-ui/styles';

// Responsive Grid based on this example
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
      height: 240,
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

const MangaGrid = props => (
  <Grid container justify="center">
    {/* Top level Grid centers the child Grid */}
    <Grid container className={props.classes.responsive} spacing={16}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => <MangaCard />)}
    </Grid>
  </Grid>
);

export default withStyles(styles)(MangaGrid);
