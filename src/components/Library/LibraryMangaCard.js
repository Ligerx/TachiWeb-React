// @flow
import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/styles";
import Badge from "@material-ui/core/Badge";
import ButtonBase from "@material-ui/core/ButtonBase";
import MangaCard from "components/MangaCard";
import Link from "components/Link";
import { Server, Client } from "api";
import type { Manga } from "@tachiweb/api-client";

const useStyles = makeStyles({
  fullWidth: {
    // While the grid item is full width, it's children aren't.
    // Need to apply width 100% multiple levels down to make things stretch correctly.
    width: "100%"
  },
  badge: {
    top: 8,
    right: 8 // Fixes badge overflowing on the x-axis
  }
});

type Props = {
  manga: Manga,
  unread: number
};

const LibraryMangaCard = ({ manga, unread }: Props) => {
  const classes = useStyles();

  return (
    <Grid item xs={6} sm={3}>
      <Badge
        badgeContent={unread}
        color="primary"
        max={9999}
        className={classes.fullWidth}
        classes={{ badge: classes.badge }}
      >
        <ButtonBase
          className={classes.fullWidth}
          component={Link}
          to={Client.manga("/library", manga.id)}
        >
          <MangaCard title={manga.title} coverUrl={Server.cover(manga.id)} />
        </ButtonBase>
      </Badge>
    </Grid>
  );
};

export default LibraryMangaCard;
