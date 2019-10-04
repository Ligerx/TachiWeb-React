// @flow
import React, { useContext, memo, useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
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
  read: {
    color: "#AAA"
  },
  listItem: {
    paddingRight: 8, // decrease padding (default 24)
    backgroundColor: "white"
  },
  chapterInfo: {
    flex: 1,
    marginRight: 8
  },
  extraInfo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  date: { flex: 1 },
  lastReadPage: { color: "rgba(0, 0, 0, 0.87)" }
});

const ChapterListItem = memo<Props>(
  ({ mangaInfo, chapter, ...otherProps }: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const classes = useStyles();
    const urlPrefix = useContext(UrlPrefixContext);

    const dimIfRead: Function = (read: boolean): ?String =>
      read ? classes.read : null;

    const chapterName: string =
      mangaInfo.flags.displayMode === "NAME"
        ? chapter.name
        : `Chapter ${chapterNumPrettyPrint(chapter.chapter_number)}`;

    const handleOpenMenu = event => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    return (
      <ListItem
        {...otherProps}
        button
        divider
        component={Link}
        to={Client.chapter(urlPrefix, mangaInfo.id, chapter.id)}
        className={classes.listItem}
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1" className={dimIfRead(chapter.read)}>
              {chapterName}
            </Typography>
          }
          secondary={
            <div className={classes.extraInfo}>
              <Typography
                variant="caption"
                className={classNames(classes.date, dimIfRead(chapter.read))}
              >
                {chapter.date ? dateFnsFormat(chapter.date, "MM/DD/YYYY") : ""}
              </Typography>

              <Typography variant="caption" className={classes.lastReadPage}>
                {chapterText(chapter.read, chapter.last_page_read)}
              </Typography>
            </div>
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

// Helper Functions
/* eslint-disable camelcase */
function chapterText(read: boolean, last_page_read: number) {
  let text: string = "";
  if (!read && last_page_read > 0) {
    text = `Page ${last_page_read + 1}`;
  }
  return text;
}
/* eslint-enable camelcase */

export default ChapterListItem;
