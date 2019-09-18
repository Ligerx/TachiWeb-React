// @flow
import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import MangaCard from "components/MangaCard";
import type { Manga } from "@tachiweb/api-client";
import { Server, Client } from "api";
import Link from "components/Link";

type Props = {
  manga: Manga
};

const useStyles = makeStyles({
  // While the grid item is full width, it's children aren't.
  // Need to apply width 100% multiple levels down to make things stretch correctly.
  fullWidth: {
    width: "100%"
  },
  isFavorited: {
    opacity: 0.5
  }
});

const CatalogueMangaCard = ({ manga }: Props) => {
  const classes = useStyles();
  return (
    <Grid
      item
      xs={6}
      sm={3}
      className={manga.favorite ? classes.isFavorited : null}
    >
      <ButtonBase
        className={classes.fullWidth}
        component={Link}
        to={Client.manga(Client.catalogues(), manga.id)}
      >
        <MangaCard title={manga.title} coverUrl={Server.cover(manga.id)} />
      </ButtonBase>
    </Grid>
  );
};

export default CatalogueMangaCard;
