// @flow
import React from "react";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import type { FavoriteFABContainerProps } from "containers/FavoriteFABContainer";

// TODO: Loading spinner flickers because of short delay.
//       Would be interesting to create a spinner with a small delay before appearing.

// FAB button position based on this link
// https://stackoverflow.com/questions/37760448/how-to-make-floating-action-button-content-overlap-two-divs-in-materializecss

// NOTE: parent must be [position: relative] for this to position correctly.
// for example:
// const styles = () => ({
//   fabParent: {
//     position: 'relative',
//   },
// });

const styles = {
  fab: {
    position: "absolute",
    bottom: 0,
    right: "5%",
    marginBottom: -18
  },
  fabProgress: {
    position: "absolute",
    animation: "fadeInFromNone 2.5s ease-out"
  }
};

type Props = { classes: Object };

const FavoriteFAB = ({
  classes,
  isFavorite,
  favoriteIsToggling,
  toggleFavorite
}: FavoriteFABContainerProps & Props) => (
  <React.Fragment>
    <Fab
      color="primary"
      className={classes.fab}
      onClick={toggleFavorite(isFavorite)}
    >
      {isFavorite ? <Icon>bookmark</Icon> : <Icon>bookmark_border</Icon>}

      {favoriteIsToggling && (
        <CircularProgress
          size={70}
          color="secondary"
          className={classes.fabProgress}
        />
      )}
    </Fab>
  </React.Fragment>
);

export default withStyles(styles)(FavoriteFAB);
