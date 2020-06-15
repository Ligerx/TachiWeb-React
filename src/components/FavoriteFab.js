// @flow
import React from "react";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/styles";
import type { Manga } from "@tachiweb/api-client";
import { useSetMangaFavorited } from "apiHooks";

// FAB button position based on this link
// https://stackoverflow.com/questions/37760448/how-to-make-floating-action-button-content-overlap-two-divs-in-materializecss

// NOTE: parent must be [position: relative] for this to position correctly.
// for example:
// const styles = () => ({
//   fabParent: {
//     position: 'relative',
//   },
// });

const useStyles = makeStyles({
  fab: {
    position: "absolute",
    bottom: 0,
    right: "5%",
    marginBottom: -18
  }
});

type Props = { manga: Manga };

const FavoriteFab = ({ manga }: Props) => {
  const classes = useStyles();

  const setMangaFavorited = useSetMangaFavorited();

  const handleToggleFavorite = () => {
    setMangaFavorited(manga.id, !manga.favorite);
  };

  return (
    <>
      <Fab
        color="primary"
        className={classes.fab}
        onClick={handleToggleFavorite}
      >
        {manga.favorite ? <Icon>bookmark</Icon> : <Icon>bookmark_border</Icon>}
      </Fab>
    </>
  );
};

export default FavoriteFab;
