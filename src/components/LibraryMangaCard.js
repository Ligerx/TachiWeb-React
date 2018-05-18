import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import Badge from 'material-ui/Badge';
import ButtonBase from 'material-ui/ButtonBase';
import MangaCard from 'components/MangaCard';
import { Link } from 'react-router-dom';
import { Server, Client } from 'api';

// TODO: don't pass the whole 'manga' object, only pass down what's necessary

// * fullWidth
// While the grid item is full width, it's children aren't.
// Need to apply width 100% multiple levels down to make things stretch correctly.
// * invisibleBadge
// Implemented hiding the badge when there's no unread manga via CSS.
// TODO: ? This is possibly harder to understand, so maybe refactor it in the future.
const styles = {
  fullWidth: {
    width: '100%',
  },
  invisibleBadge: {
    visibility: 'hidden',
  },
};

const LibraryMangaCard = ({ classes, manga }) => (
  <Grid item xs={6} sm={3}>
    <Badge
      badgeContent={manga.unread}
      color="primary"
      className={classes.fullWidth}
      classes={{
        badge: manga.unread > 0 ? null : classes.invisibleBadge,
      }}
    >
      <ButtonBase className={classes.fullWidth} component={Link} to={Client.manga(manga.id)}>
        <MangaCard title={manga.title} coverUrl={Server.cover(manga.id)} />
      </ButtonBase>
    </Badge>
  </Grid>
);

// TODO: props validation?

export default withStyles(styles)(LibraryMangaCard);
