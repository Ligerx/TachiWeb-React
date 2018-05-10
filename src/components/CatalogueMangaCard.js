import React from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import ButtonBase from 'material-ui/ButtonBase';
import MangaCard from 'components/MangaCard';
import { Link } from 'react-router-dom';
import { Client } from 'api';
import PropTypes from 'prop-types';
import { mangaType } from 'types';

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

const CatalogueMangaCard = ({ classes, manga }) => (
  <Grid item xs={6} sm={3} className={manga.favorite ? classes.isFavorited : null}>
    <ButtonBase className={classes.fullWidth} component={Link} to={Client.manga(manga.id)}>
      <MangaCard title={manga.title} thumbnailUrl={manga.thumbnail_url} />
    </ButtonBase>
  </Grid>
);

CatalogueMangaCard.propTypes = {
  classes: PropTypes.object.isRequired,
  manga: mangaType.isRequired,
};

export default withStyles(styles)(CatalogueMangaCard);
