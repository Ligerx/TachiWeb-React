// @flow
import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/styles";
import Badge from "@material-ui/core/Badge";
import ButtonBase from "@material-ui/core/ButtonBase";
import Checkbox from "@material-ui/core/Checkbox";
import MangaCard from "components/MangaCard";
import Link from "components/Link";
import { Server } from "api";
import type { Manga } from "@tachiweb/api-client";

type Props = {
  to: string,
  manga: Manga,
  unread: number,
  isSelected: boolean,
  showSelectedCheckbox: boolean, // show unselected checkbox if any other manga is selected
  onSelectedToggle: (number, boolean) => any
};

const useStyles = makeStyles({
  // While the grid item is full width, it's children aren't.
  // Need to apply width 100% multiple levels down to make things stretch correctly.
  card: {
    width: "100%"
  },
  badgeRoot: {
    width: "100%"
  },

  badge: {
    top: 8,
    right: 8 // Mostly fixes badge overflowing on the x-axis
  },

  root: {
    "&:hover $checkboxWrapper": {
      visibility: "visible"
    }
  },
  checkboxWrapper: {
    backgroundColor: "white",
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,

    visibility: ({ showSelectedCheckbox }) =>
      showSelectedCheckbox ? "visible" : "hidden"
  },
  checkbox: {
    padding: 0
  }
});

const LibraryMangaCard = ({
  to,
  manga,
  unread,
  isSelected,
  showSelectedCheckbox,
  onSelectedToggle
}: Props) => {
  const classes = useStyles({ showSelectedCheckbox });

  const handleSelectedToggle = event => {
    onSelectedToggle(manga.id, event.target.checked);
  };

  // When selecting manga, hijack the card's click to select instead of navigating
  const handleClick = event => {
    if (showSelectedCheckbox) {
      event.preventDefault();
      onSelectedToggle(manga.id, !isSelected);
    }
  };

  return (
    <Grid item xs={6} sm={3} className={classes.root}>
      <Badge
        badgeContent={unread}
        color="primary"
        max={9999}
        className={classes.badgeRoot}
        classes={{ badge: classes.badge }}
      >
        {/* FIXME: Fit element size to checkbox icon size, give icon a fill background
            color, remove white background div.
            Material-UI checkboxes are vector lines with no background fill color. They also take up
            a bunch of space instead of hugging the side of the checkbox icon.
            Given how much time I put into figuring out the current hacky white background,
            fixing this will probably be very tedious */}
        <div className={classes.checkboxWrapper}>
          <Checkbox
            className={classes.checkbox}
            checked={isSelected}
            onChange={handleSelectedToggle}
            color="primary"
          />
        </div>

        <ButtonBase
          className={classes.card}
          component={Link}
          to={to}
          onClick={handleClick}
        >
          <MangaCard title={manga.title} coverUrl={Server.cover(manga.id)} />
        </ButtonBase>
      </Badge>
    </Grid>
  );
};

export default LibraryMangaCard;
