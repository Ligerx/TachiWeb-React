// @flow
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef
} from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { Manga } from "@tachiweb/api-client";
import type { ChapterType, ChapterPageLinkState } from "types";
import { Server, Client } from "api";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import ImageWithLoader from "components/Reader/ImageWithLoader";
import ReaderOverlay from "components/Reader/ReaderOverlay";
import ResponsiveGrid from "components/ResponsiveGrid";
import { chapterNumPrettyPrint } from "components/utils";
import UrlPrefixContext from "components/UrlPrefixContext";
import {
  usePagePreloader,
  useUpdateReadingStatus,
  useReaderScrollToTop
} from "components/Reader/utils";

// It's easier to have the parent component pass non-null props to avoid null checking.
// Hooks rely on call order which makes null checking somewhat painful.

type Props = {
  mangaInfo: Manga,
  chapter: ChapterType,
  pageCount: number,
  prevChapter: ?ChapterType,
  nextChapter: ?ChapterType,
  prevChapterPageCount: ?number
};

type RouterProps = {
  history: {
    push: Function,
    location: {
      state: ?ChapterPageLinkState
    }
  }
};

const useStyles = makeStyles({
  page: {
    width: "100%"
  },
  navButtonsParent: {
    display: "flex",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40
  },
  topOffset: {
    marginTop: 144
  }
});

const WebtoonReader = ({
  mangaInfo,
  chapter,
  pageCount,
  prevChapter,
  nextChapter,
  prevChapterPageCount,
  history: {
    push,
    location: { state }
  }
}: Props & RouterProps) => {
  const classes = useStyles();
  const urlPrefix = useContext(UrlPrefixContext);

  // Initialize the starting page. This only runs once on first mount.
  const lastReadPage = chapter.read ? 0 : chapter.last_page_read;
  const [page, setPage] = useState(lastReadPage);

  const prevChapterUrl =
    prevChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, prevChapter.id)
      : null;

  const nextChapterUrl =
    nextChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, nextChapter.id)
      : null;

  useReaderScrollToTop(mangaInfo.id, chapter.id);

  usePagePreloader(
    mangaInfo.id,
    chapter.id,
    page,
    pageCount,
    nextChapter ? nextChapter.id : null
  );

  useUpdateReadingStatus(mangaInfo.id, chapter.id, page);

  return (
    <>
      <Helmet
        title={`${mangaInfo.title} - Ch. ${chapterNumPrettyPrint(
          chapter.chapter_number
        )}, Pg. ${page + 1} TachiWeb`}
      />

      <ReaderOverlay
        title={mangaInfo.title}
        chapterNum={chapter.chapter_number}
        pageCount={pageCount}
        page={page}
        backUrl={Client.manga(urlPrefix, mangaInfo.id)}
        prevChapterUrl={prevChapterUrl}
        nextChapterUrl={nextChapterUrl}
        onJumpToPage={setPage}
      />

      <ResponsiveGrid className={classes.topOffset}>
        <Grid item xs={12} onClick={handleNextPage}>
          <ImageWithLoader
            src={Server.image(mangaInfo.id, chapter.id, page)}
            className={classes.page}
            alt={`${chapter.name} - Page ${page + 1}`}
          />
        </Grid>

        <Grid item xs={12} className={classes.navButtonsParent}>
          <Button onClick={handlePrevPage} disabled={!hasPrevPage}>
            <Icon>navigate_before</Icon>
            Previous Page
          </Button>
          <Button onClick={handleNextPage} disabled={!hasNextPage}>
            Next Page
            <Icon>navigate_next</Icon>
          </Button>
        </Grid>
      </ResponsiveGrid>
    </>
  );
};

export default withRouter(WebtoonReader);
