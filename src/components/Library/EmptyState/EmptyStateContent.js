// @flow
import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import HelpDialog from "components/Library/EmptyState/HelpDialog";
// This is how you import SVG files as components
// https://create-react-app.dev/docs/adding-images-fonts-and-files
import { ReactComponent as EmptyStateSVG } from "./tachiyomi-greyscale-backdrop.svg";

type Props = {
  className?: string
};

const useStyles = makeStyles({
  root: {
    // align contents
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  },
  svg: {
    marginBottom: 16
  },
  icon: {
    verticalAlign: "middle"
  }
});

const EmptyStateContent = ({ className }: Props, ref) => {
  const classes = useStyles();

  return (
    <div className={classNames(classes.root, className)} ref={ref}>
      <EmptyStateSVG className={classes.svg} />
      <Typography variant="h6" alignt="center" gutterBottom>
        No manga added yet <HelpDialog />
      </Typography>

      <Typography color="textSecondary" align="center">
        To get started, first <strong>install an extension.</strong> <br />
        Second, <strong>search</strong> for manga in your
        <strong> catalogues</strong>. <br />
        Then, <Icon className={classes.icon}>bookmark</Icon>
        <strong>bookmark manga</strong> to save them to this page.
      </Typography>
    </div>
  );
};

export default React.forwardRef<Props, typeof EmptyStateContent>(
  EmptyStateContent
);
