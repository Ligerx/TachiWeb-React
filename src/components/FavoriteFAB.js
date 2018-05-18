import React from 'react';
import Icon from '@material-ui/core/Icon';
import FAB from 'components/FAB';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

// NOTE: refer to FAB for specific CSS instructions

// TODO: Loading spinner flickers because of short delay.
//       Would be interesting to create a spinner with a small delay before appearing.

const styles = {
  fabProgress: {
    position: 'absolute',
    animation: 'fadeInFromNone 2.5s ease-out',
  },
};

const FavoriteFAB = ({
  classes, isFavorite, isTogglingFavorite, toggleFavorite,
}) => (
  <React.Fragment>
    <FAB onClick={toggleFavorite}>
      {isFavorite ? <Icon>bookmark</Icon> : <Icon>bookmark_border</Icon>}
      {isTogglingFavorite && (
        <CircularProgress size={70} color="secondary" className={classes.fabProgress} />
      )}
    </FAB>
  </React.Fragment>
);

FavoriteFAB.propTypes = {
  classes: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isTogglingFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default withStyles(styles)(FavoriteFAB);
