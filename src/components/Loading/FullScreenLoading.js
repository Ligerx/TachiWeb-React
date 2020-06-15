// @flow
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  loader: {
    position: "fixed",
    margin: "auto",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});

const FullScreenLoading = () => {
  const classes = useStyles();

  // https://material-ui.com/components/progress/#limitations
  // Disabling the shrinking animation because the spinner will frequently display as a tiny line instead
  return (
    <CircularProgress
      className={classes.loader}
      size={60}
      thickness={4.5}
      disableShrink
    />
  );
};

export default FullScreenLoading;
