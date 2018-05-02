import React from 'react';
import Typography from 'material-ui/Typography';
import ResponsiveGrid from 'components/ResponsiveGrid';
import MangaCard from 'components/MangaCard';
import Grid from 'material-ui/Grid';
import BackgroundImage from 'components/BackgroundImage';
import { withStyles } from 'material-ui/styles';
import FavoriteFAB from 'components/FavoriteFAB';

// TODO: make the html a bit more DRY
// TODO: increase top/bottom padding for description so it doesn't touch the FAB
// TODO: I think the FAB is positioning based on the full screen width, not the inside of the responsive grid.
//     however, because of the responsive grid's padding, it makes positioning weird

const styles = () => ({
  gridPadding: {
    padding: '32px 24px',
  },
  fabParent: {
    position: 'relative',
  },
});

const MangaInfoDetails = ({ classes, mangaInfo, onFavoriteClick }) => (
  <div>
    <BackgroundImage thumbnailUrl={mangaInfo.thumbnail_url} className={classes.fabParent}>
      <ResponsiveGrid className={classes.gridPadding}>
        <Grid item xs={4} sm={3}>
          <MangaCard thumbnailUrl={mangaInfo.thumbnail_url} />
        </Grid>
        <Grid item xs={8} sm={9}>
          <Typography variant="title" gutterBottom>
            {mangaInfo.title}
          </Typography>
          <Typography>
            <strong>Author: </strong>
            {mangaInfo.author}
            <br />
            <strong>Chapters: </strong>
            {mangaInfo.chapters}
            <br />
            <strong>Status: </strong>
            {mangaInfo.status}
            <br />
            <strong>Source: </strong>
            {mangaInfo.source}
            <br />
            <strong>Genres: </strong>
            {mangaInfo.genres}
            <br />
          </Typography>
        </Grid>
      </ResponsiveGrid>

      <FavoriteFAB favorite={mangaInfo.favorite} onClick={onFavoriteClick} />
    </BackgroundImage>

    <ResponsiveGrid className={classes.gridPadding}>
      <Typography>
        <strong>Description: </strong>
        {mangaInfo.description}
      </Typography>
    </ResponsiveGrid>
  </div>
);

export default withStyles(styles)(MangaInfoDetails);
