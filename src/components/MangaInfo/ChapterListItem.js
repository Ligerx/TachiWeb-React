// @flow
import React, { useContext, memo, useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Link from "components/Link";
import type { ChapterType } from "types";
import type { Manga } from "@tachiweb/api-client";
import { chapterNumPrettyPrint } from "components/utils";
import ChapterMenu from "components/MangaInfo/ChapterMenu";
import UrlPrefixContext from "components/UrlPrefixContext";
import { Client } from "api";
import dateFnsFormat from "date-fns/format";
import { makeStyles } from "@material-ui/styles";

type Props = {
  mangaInfo: Manga,
  chapter: ChapterType
}; // other props will be passed to the root ListItem

const useStyles = makeStyles({
  root: {
    backgroundColor: "white"
  },
  lastReadPage: {
    marginLeft: 128
  }
});

const ChapterListItem = memo<Props>(
  ({ mangaInfo, chapter, ...otherProps }: Props) => {
    const classes = useStyles();
    const urlPrefix = useContext(UrlPrefixContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const chapterName =
      mangaInfo.flags.displayMode === "NAME"
        ? chapter.name
        : `Chapter ${chapterNumPrettyPrint(chapter.chapter_number)}`;

    const lastReadPage =
      chapter.read || chapter.last_page_read === 0
        ? null
        : `Page: ${chapter.last_page_read + 1}`;

    // stopping event bubbling shouldn't be necessary according to the docs but it's
    // still happening...
    const handleOpenMenu = event => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = event => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(null);
    };

    return (
      <ListItem
        {...otherProps}
        button
        divider
        component={Link}
        to={Client.chapter(urlPrefix, mangaInfo.id, chapter.id)}
        className={classes.root}
      >
        <ListItemText
          primary={chapterName}
          primaryTypographyProps={{
            color: chapter.read ? "textSecondary" : "textPrimary"
          }}
          secondary={
            <>
              {chapter.date ? dateFnsFormat(chapter.date, "MM/DD/YYYY") : ""}
              <Typography variant="inherit" className={classes.lastReadPage}>
                {lastReadPage}
              </Typography>
            </>
          }
        />

        <ListItemSecondaryAction>
          <IconButton onClick={handleOpenMenu}>
            <Icon>more_vert</Icon>
          </IconButton>
        </ListItemSecondaryAction>

        <ChapterMenu
          mangaId={mangaInfo.id}
          chapter={chapter}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
        />
      </ListItem>
    );
  }
);

export default ChapterListItem;
