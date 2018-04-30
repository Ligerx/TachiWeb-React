import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Badge from 'material-ui/Badge';

// * media
// This component makes the image fill the entire container by default
// Image aspect ratio hack
// height: 0, paddingTop: X%   [(Image Height / Image Width) * 100%]
// * badge, card
// For some reason, putting a badge around the card makes it a fixed width instead of responsive.
// Force width 100% on both to fix this.
const styles = {
  media: {
    height: 0,
    paddingTop: '130%',
  },
  badge: {
    width: '100%',
  },
  card: {
    width: '100%',
  },
};

const MangaCard = props => (
  <Grid item xs={6} sm={3}>
    <Badge badgeContent={3} color="primary" className={props.classes.badge}>
      <Card className={props.classes.card}>
        <CardMedia
          className={props.classes.media}
          image="https://www.readmng.com/uploads/posters/0001_269.jpg"
          title="Random Manga"
        />
        <CardContent>
          <Typography variant="headline">Manga Title</Typography>
        </CardContent>
      </Card>
    </Badge>
  </Grid>
);

export default withStyles(styles)(MangaCard);

// Average size cover
// https://www.readmng.com/uploads/posters/0001_269.jpg

// Really tall cover
// http://a.fanfox.net/store/manga/14588/cover.jpg?token=054f13d1a85f674b17d6c893d46810048d56c17a&ttl=1524697200&v=1523545985

// Really short cover
// https://www.readmng.com/uploads/posters/4f28b6a2a8453e807dd3a11a16a7108b_8.png
