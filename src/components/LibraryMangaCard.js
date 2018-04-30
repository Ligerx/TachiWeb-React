import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Badge from 'material-ui/Badge';
import ButtonBase from 'material-ui/ButtonBase';
import MangaCard from 'components/MangaCard';

// TODO: disable badge when it's value is 0

// * fullWidth
// While the grid item is full width, it's children aren't.
// Need to apply width 100% multiple levels down to make things stretch correctly.
const styles = {
  fullWidth: {
    width: '100%',
  },
};

const LibraryMangaCard = ({ classes, manga }) => (
  <Grid item xs={6} sm={3}>
    <Badge badgeContent={manga.unread} color="primary" className={classes.fullWidth}>
      <ButtonBase className={classes.fullWidth}>
        <MangaCard title={manga.title} thumbnailUrl={manga.thumbnail_url} />
      </ButtonBase>
    </Badge>
  </Grid>
);

// TODO: props validation?

export default withStyles(styles)(LibraryMangaCard);
