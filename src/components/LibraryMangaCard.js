// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import ButtonBase from '@material-ui/core/ButtonBase';
import MangaCard from 'components/MangaCard';
import { Link } from 'react-router-dom';
import { Server, Client } from 'api';
import type { MangaType } from 'types';

// TODO: Currently passing in the entire unread object, not just the corresponding number
//       ^ Would have to rework the component tree a big to make that happen.

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

type Props = {
  classes: Object,
  manga: MangaType,
  unread: { [mangaId: number]: number },
};

const LibraryMangaCard = ({ classes, manga, unread }: Props) => (
  <Grid item xs={6} sm={3}>
    <Badge
      badgeContent={unread[manga.id] || 0}
      color="primary"
      className={classes.fullWidth}
      classes={{
        badge: unread[manga.id] > 0 ? null : classes.invisibleBadge,
      }}
    >
      <ButtonBase className={classes.fullWidth} component={Link} to={Client.manga(manga.id)}>
        <MangaCard title={manga.title} coverUrl={Server.cover(manga.id)} />
      </ButtonBase>
    </Badge>
  </Grid>
);

export default withStyles(styles)(LibraryMangaCard);
