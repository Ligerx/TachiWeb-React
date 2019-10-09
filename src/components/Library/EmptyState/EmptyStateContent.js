// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// This is how you import SVG files as components
// https://create-react-app.dev/docs/adding-images-fonts-and-files
import { ReactComponent as EmptyStateSVG } from "./tachiyomi-greyscale-backdrop.svg";

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 40,
    paddingBottom: 40
  },
  svg: {
    marginBottom: 16
  }
});

const EmptyStateContent = (_, ref) => {
  const classes = useStyles();

  return (
    <Container maxWidth="xs" className={classes.root} ref={ref}>
      <EmptyStateSVG className={classes.svg} />
      <Typography variant="h6" alignt="center" gutterBottom>
        No manga added yet
      </Typography>
      <Typography color="textSecondary" align="center">
        To get started, first <strong>install an extension.</strong> <br />
        Second, <strong>search for manga</strong> in your catalogues. <br />
        Then, <strong>bookmark manga</strong> to save them to this page.
      </Typography>
    </Container>
  );
};

export default React.forwardRef<Props, typeof EmptyStateContent>(
  EmptyStateContent
);
