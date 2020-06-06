// @flow
import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Link from "components/Link";
import { chapterNumPrettyPrint } from "components/utils";
import UrlPrefixContext from "components/UrlPrefixContext";
import { Client } from "api";
import { makeStyles } from "@material-ui/styles";
import { useFirstUnreadChapter } from "apiHooks";

// The chapters list passed into this component should NOT be sorted or filtered.
// It iterates through the chapters array based on the array's natural order.
// Expecting chapters to be in ascending order.

// TODO: make sure that chapter_number is displayed correctly (rounding)
//      ^ Might want to create a utility function, and use it in the chapter list and reader too.

// TODO: add some spacing between the play icon and text

const useStyles = makeStyles({
  button: {
    marginBottom: 24
  }
});

type Props = {
  mangaId: number
};

const ContinueReadingButton = ({ mangaId }: Props) => {
  const classes = useStyles();
  const urlPrefix = useContext(UrlPrefixContext);

  const { data: firstUnreadChapter } = useFirstUnreadChapter(mangaId);

  if (firstUnreadChapter) {
    return (
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        component={Link}
        to={Client.chapter(urlPrefix, mangaId, firstUnreadChapter.id)}
      >
        <Icon>play_arrow</Icon>
        {`Continue Reading Ch. ${chapterNumPrettyPrint(
          firstUnreadChapter.chapter_number
        )}`}
      </Button>
    );
  }
  return (
    <Button variant="contained" disabled className={classes.button}>
      No Unread Chapters
    </Button>
  );
};

export default ContinueReadingButton;
