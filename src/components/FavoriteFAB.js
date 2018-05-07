import React from 'react';
import Icon from 'material-ui/Icon';
import FAB from 'components/FAB';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

// NOTE: refer to FAB for specific CSS instructions

// TODO: Loading spinner flickers because of short delay.
//       Would be interesting to create a spinner with a small delay before appearing.

// TODO: I think the FAB is positioning based on the full screen width, not the inside of the responsive grid.
//     however, because of the responsive grid's padding, it makes positioning weird

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
