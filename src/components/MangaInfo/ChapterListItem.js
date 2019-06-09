// @flow
import React, { useContext, memo } from "react";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import Link from "components/Link";
import type { ChapterType, MangaType } from "types";
import { chapterNumPrettyPrint } from "components/utils";
import ChapterMenu from "components/MangaInfo/ChapterMenu";
import UrlPrefixContext from "components/UrlPrefixContext";
import { Client } from "api";
import dateFnsFormat from "date-fns/format";
import { useDispatch } from "react-redux";
import { toggleRead } from "redux-ducks/chapters";
import { makeStyles } from "@material-ui/styles";

type Props = {
  mangaInfo: MangaType,
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

const ChapterListItem = memo(({ mangaInfo, chapter, ...otherProps }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleToggleRead = (read: boolean) =>
    dispatch(toggleRead(mangaInfo.id, chapter.id, read));

  const urlPrefix = useContext(UrlPrefixContext);

  const dimIfRead: Function = (read: boolean): ?String =>
    read ? classes.read : null;
  const goToPage: number = chapter.read ? 0 : chapter.last_page_read;
  const chapterName: string =
    mangaInfo.flags.DISPLAY_MODE === "NAME"
      ? chapter.name
      : `Chapter ${chapterNumPrettyPrint(chapter.chapter_number)}`;

  return (
    <ListItem
      {...otherProps}
      button
      divider
      component={Link}
      to={Client.page(urlPrefix, mangaInfo.id, chapter.id, goToPage)}
      className={classes.listItem}
    >
      <div className={classes.chapterInfo}>
        <Typography variant="subtitle1" className={dimIfRead(chapter.read)}>
          {chapterName}
        </Typography>

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
      </div>

      <ChapterMenu chapter={chapter} toggleRead={handleToggleRead} />
    </ListItem>
  );
});

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
