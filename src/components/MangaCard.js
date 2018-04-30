import React from 'react';
import Grid from 'material-ui/Grid';
import Card, { CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Badge from 'material-ui/Badge';

// TODO: disable badge when it's value is 0
// TODO: Ripple effect on this component?

// //// Sample Cover Images
// Average size cover
// https://www.readmng.com/uploads/posters/0001_269.jpg

// Really tall cover
// http://a.fanfox.net/store/manga/14588/cover.jpg?token=054f13d1a85f674b17d6c893d46810048d56c17a&ttl=1524697200&v=1523545985

// Really short cover
// https://www.readmng.com/uploads/posters/4f28b6a2a8453e807dd3a11a16a7108b_8.png

// * media
// This component makes the image fill the entire container by default
// Image aspect ratio hack
// height: 0, paddingTop: X%   [(Image Height / Image Width) * 100%]
// * badge, card
// For some reason, putting a badge around the card makes it a fixed width instead of responsive.
// Force width 100% on both to fix this.
const styles = {
  image: {
    height: 0,
    paddingTop: '130%',
  },
  badge: {
    width: '100%',
  },
  card: {
    width: '100%',
  },
  title: {
    color: 'white',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: '28px 16px 18px',
    background:
      'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0) 100%)',
  },
};

const MangaCard = ({ classes, manga }) => (
  <Grid item xs={6} sm={3}>
    <Badge badgeContent={manga.unread} color="primary" className={classes.badge}>
      <Card className={classes.card}>
        <CardMedia className={classes.image} image={manga.thumbnail_url} title={manga.title} />
        <div className={classes.gradient}>
          <Typography variant="title" className={classes.title}>
            {manga.title}
          </Typography>
        </div>
      </Card>
    </Badge>
  </Grid>
);

export default withStyles(styles)(MangaCard);
