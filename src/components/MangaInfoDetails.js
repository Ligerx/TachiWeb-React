import React from 'react';
import Typography from 'material-ui/Typography';
import ResponsiveGrid from 'components/ResponsiveGrid';
import MangaCard from 'components/MangaCard';
import Grid from 'material-ui/Grid';
import BackgroundImage from 'components/BackgroundImage';
import { withStyles } from 'material-ui/styles';
import { mangaType } from 'types';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Server } from 'api';

// TODO: increase top/bottom padding for description so it doesn't touch the FAB

const styles = () => ({
  gridPadding: {
    padding: '32px 24px',
  },
  fabParent: {
    position: 'relative',
  },
});

const MangaInfoDetails = ({ classes, mangaInfo, numChapters, children }) => (
  <React.Fragment>
    <BackgroundImage coverUrl={Server.cover(mangaInfo.id)}>
      <ResponsiveGrid className={classNames(classes.gridPadding, classes.fabParent)}>
        <Grid item xs={4} sm={3}>
          <MangaCard coverUrl={Server.cover(mangaInfo.id)} />
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
            {numChapters}
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

        {children}
      </ResponsiveGrid>
    </BackgroundImage>

    <ResponsiveGrid className={classes.gridPadding}>
      <Typography>
        <strong>Description: </strong>
        {mangaInfo.description}
      </Typography>
    </ResponsiveGrid>
  </React.Fragment>
);

MangaInfoDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  mangaInfo: mangaType.isRequired,
  numChapters: PropTypes.number.isRequired,
  children: PropTypes.node,
};

MangaInfoDetails.defaultProps = {
  children: null,
};

export default withStyles(styles)(MangaInfoDetails);
