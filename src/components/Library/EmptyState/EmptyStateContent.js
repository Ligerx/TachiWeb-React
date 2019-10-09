// @flow
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// This is how you import SVG files as components
// https://create-react-app.dev/docs/adding-images-fonts-and-files
import { ReactComponent as EmptyStateSVG } from "./tachiyomi-greyscale-backdrop.svg";

const useStyles = makeStyles({
  root: {
    // push the content below the header
    marginTop: 64 + 80,

    // align contents
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  },
  svg: {
    marginBottom: 16
  }
});

const EmptyStateContent = (_, ref) => {
  const classes = useStyles();

  return (
    <div className={classes.root} ref={ref}>
      <EmptyStateSVG className={classes.svg} />
      <Typography variant="h6" alignt="center" gutterBottom>
        No manga added yet
      </Typography>
      <Typography color="textSecondary" align="center">
        To get started, first <strong>install an extension.</strong> <br />
        Second, <strong>search for manga</strong> in your catalogues. <br />
        Then, <strong>bookmark manga</strong> to save them to this page.
      </Typography>
    </div>
  );
};

export default React.forwardRef<{}, typeof EmptyStateContent>(
  EmptyStateContent
);
