// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  loaderParent: {
    // based on CircularProgress size
    width: 40,
    height: 40,

    margin: '24px auto 40px',
  },
  // Not styling the spinner directly because it's rotating, so its size fluctuates
};

type Props = { classes: Object };

const CenteredLoading = ({ classes }: Props) => (
  <div className={classes.loaderParent}>
    <CircularProgress />
  </div>
);

export default withStyles(styles)(CenteredLoading);
