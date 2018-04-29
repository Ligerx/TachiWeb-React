import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

const tempStyle = {
  paddingTop: 16,
  paddingBottom: 48,
  paddingLeft: 24,
};

const MangaCard = () => (
  <Grid item xs={6}>
    <Paper style={tempStyle}>xs=12</Paper>
  </Grid>
);

export default MangaCard;
