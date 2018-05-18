import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const styles = {
  // TODO: Position the controls div so that it's always at the top of the viewport
  //       I tried with position sticky and absolute, but it didn't work as intended
  //       Try again in the future
  controls: {
    paddingTop: 12,
    marginBottom: 8,
  },
  actionButtons: {
    marginBottom: 12,
    // Center align and stretch to fit
    display: 'flex',
    justifyContent: 'space-around',
    '& > *': {
      flexBasis: '40%',
    },
  },
};

const FilterActions = ({ classes, onResetClick, onSearchClick }) => (
  <div className={classes.controls}>
    <div className={classes.actionButtons}>
      <Button onClick={onResetClick}>Reset</Button>
      <Button variant="raised" color="primary" onClick={onSearchClick}>
        Search
      </Button>
    </div>
    <Divider />
  </div>
);

FilterActions.propTypes = {
  classes: PropTypes.object.isRequired,
  onResetClick: PropTypes.func.isRequired,
  onSearchClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(FilterActions);
