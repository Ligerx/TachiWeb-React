import React from 'react';
import Icon from 'material-ui/Icon';
import FAB from 'components/FAB';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

// NOTE: refer to FAB for specific CSS instructions

// TODO: would be nice to have a loading spinner while the server processes a favorite/unfavorite action
const styles = {
  fabProgress: {
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
};

const FavoriteFAB = ({
  classes, isFavorite, isTogglingFavorite, toggleFavorite,
}) => (
  <React.Fragment>
    <FAB onClick={toggleFavorite}>
      {isFavorite ? <Icon>bookmark</Icon> : <Icon>bookmark_border</Icon>}
    </FAB>
    {isTogglingFavorite && <CircularProgress size={68} className={classes.fabProgress} />}
  </React.Fragment>
);

FavoriteFAB.propTypes = {
  classes: PropTypes.object.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isTogglingFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default withStyles(styles)(FavoriteFAB);
