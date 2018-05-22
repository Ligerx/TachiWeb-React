// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import MangaCard from 'components/MangaCard';
import { MangaType } from 'types';
import { Server } from 'api';

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
  manga: MangaType,
  onClick: Function,
};

const CatalogueMangaCard = ({ classes, manga, onClick }: Props) => (
  <Grid item xs={6} sm={3} className={manga.favorite ? classes.isFavorited : null}>
    <ButtonBase className={classes.fullWidth} onClick={onClick(manga.id)}>
      <MangaCard title={manga.title} coverUrl={Server.cover(manga.id)} />
    </ButtonBase>
  </Grid>
);

export default withStyles(styles)(CatalogueMangaCard);
