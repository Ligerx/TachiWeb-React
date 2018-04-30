import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import MangaCard from 'components/MangaCard';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';

// Responsive Grid based on this example
// https://stackoverflow.com/questions/49251454/grid-container-like-bootstrap-container

// TODO: Adjust maxWidth breakpoint to be something reasonable
// TODO: Make sure maxWidth transitions smoothly between breakpoints
// TODO: filtering. does that happen here or the parent?

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

const MangaGrid = ({ classes, mangaLibrary }) => (
  <Grid container justify="center">
    {/* Top level Grid centers the child Grid */}
    <Grid container className={classes.responsive} spacing={16}>
      {mangaLibrary.map(manga => <MangaCard key={manga.id} manga={manga} />)}
    </Grid>
  </Grid>
);

// TODO: make proptypes more explicit?
MangaGrid.propTypes = {
  mangaLibrary: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MangaGrid);
