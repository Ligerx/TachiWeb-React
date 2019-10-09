// @flow
import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// This is how you import SVG files as components
// https://create-react-app.dev/docs/adding-images-fonts-and-files
import { ReactComponent as EmptyStateSVG } from "./tachiyomi-greyscale-backdrop.svg";

type Props = {
  className?: Object
};

const useStyles = makeStyles({
  root: {
    // align contents
    // using inline-flex to make the width fit the content
    display: "inline-flex",
    alignItems: "center",
    flexDirection: "column",

    margin: 40
  },
  svg: {
    marginBottom: 16
  }
});

const EmptyStateContent = ({ className }: Props, ref) => {
  const classes = useStyles();

  return (
    <div className={classNames(classes.root, className)} ref={ref}>
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

export default React.forwardRef<Props, typeof EmptyStateContent>(
  EmptyStateContent
);
