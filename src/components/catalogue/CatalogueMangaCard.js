// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import MangaCard from 'components/MangaCard';
import { Server, Client } from 'api';
import Link from 'components/Link';
import type { Manga } from "@tachiweb/api-client";

// * fullWidth
// While the grid item is full width, it's children aren't.
// Need to apply width 100% multiple levels down to make things stretch correctly.
const styles = {
  fullWidth: {
    width: '100%',
  },
  isFavorited: {
    opacity: 0.5,
  },
};

type Props = {
  classes: Object,
  manga: Manga,
};

const CatalogueMangaCard = ({ classes, manga }: Props) => (
  <Grid item xs={6} sm={3} className={manga.favorite ? classes.isFavorited : null}>
    <ButtonBase
      className={classes.fullWidth}
      component={Link}
      to={Client.manga('/catalogue', manga.id)}
    >
      <MangaCard title={manga.title} coverUrl={Server.cover(manga.id)} />
    </ButtonBase>
  </Grid>
);

export default withStyles(styles)(CatalogueMangaCard);
