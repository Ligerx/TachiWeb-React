import React from 'react';
import Typography from '@material-ui/core/Typography';
import ResponsiveGrid from 'components/ResponsiveGrid';
import MangaCard from 'components/MangaCard';
import Grid from '@material-ui/core/Grid';
import BackgroundImage from 'components/BackgroundImage';
import { withStyles } from '@material-ui/core/styles';
import { mangaType } from 'types';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Server } from 'api';
import upperFirst from 'lodash/upperFirst';

// TODO: increase top/bottom padding for description so it doesn't touch the FAB

const styles = () => ({
  gridPadding: {
    padding: '32px 24px',
  },
  fabParent: {
    position: 'relative',
  },
});

const MangaInfoDetails = ({
  classes, mangaInfo, numChapters, children,
}) => {
  const coverUrl = mangaInfo ? Server.cover(mangaInfo.id) : '';
  const title = mangaInfo ? mangaInfo.title : '';
  const description = mangaInfo ? mangaInfo.description : '';

  return (
    <React.Fragment>
      <BackgroundImage coverUrl={coverUrl}>
        <ResponsiveGrid className={classNames(classes.gridPadding, classes.fabParent)}>
          <Grid item xs={4} sm={3}>
            <MangaCard coverUrl={coverUrl} />
          </Grid>
          <Grid item xs={8} sm={9}>
            <Typography variant="title" gutterBottom>
              {title}
            </Typography>
            <DetailComponent fieldName="Chapters" value={numChapters} />
            {detailsElements(mangaInfo)}
          </Grid>

          {children}
        </ResponsiveGrid>
      </BackgroundImage>

      <ResponsiveGrid className={classes.gridPadding}>
        <DetailComponent fieldName="Description" value={description} />
      </ResponsiveGrid>
    </React.Fragment>
  );
};

// Helper functions
function detailsElements(mangaInfo) {
  if (!mangaInfo) return null;

  const fieldNames = [
    'status',
    'source',
    'author',
    'genres',
    'categories',
  ];

  return fieldNames.map((fieldName, index) => {
    const value = mangaInfo[fieldName];
    if ((!Array.isArray(value) && value) || (Array.isArray(value) && value.length > 0)) {
      return <DetailComponent fieldName={fieldName} value={value} key={index} />;
    }
    return null;
  });
}

const DetailComponent = ({ fieldName, value }) => (
  <Typography>
    <b>{`${upperFirst(fieldName)}: `}</b>
    {value}
  </Typography>
);

MangaInfoDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  mangaInfo: mangaType,
  numChapters: PropTypes.number,
  children: PropTypes.node,
};

MangaInfoDetails.defaultProps = {
  mangaInfo: null,
  numChapters: 0,
  children: null,
};

export default withStyles(styles)(MangaInfoDetails);
