// @flow
import React, { useState, useEffect, useContext, useCallback } from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import compact from "lodash/compact";
import type { Manga } from "@tachiweb/api-client";
import type { ChapterType } from "types";
import { Server, Client } from "api";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Link from "components/Link";
import ImageWithLoader from "components/Reader/ImageWithLoader";
import ReaderOverlay from "components/Reader/ReaderOverlay";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import SinglePageReader from "components/Reader/SinglePageReader";
import WebtoonReader from "components/Reader/WebtoonReader";
import ReadingStatusUpdater from "components/Reader/ReadingStatusUpdater";
import ImagePreloader from "components/Reader/ImagePreloader";
import ResponsiveGrid from "components/ResponsiveGrid";
import { chapterNumPrettyPrint } from "components/utils";
import UrlPrefixContext from "components/UrlPrefixContext";
import {
  usePagePreloader,
  useUpdateReadingStatus
} from "components/Reader/utils";
import {
  selectChaptersForManga,
  selectChapter,
  selectNextChapter,
  selectPrevChapter
} from "redux-ducks/chapters";
import { fetchChapters } from "redux-ducks/chapters/actionCreators";
import { selectPageCounts, selectPageCount } from "redux-ducks/pageCounts";
import { fetchPageCount } from "redux-ducks/pageCounts/actionCreators";
import { selectDefaultViewer } from "redux-ducks/settings";
import { selectMangaInfo } from "redux-ducks/mangaInfos";
import { fetchMangaInfo } from "redux-ducks/mangaInfos/actionCreators";

// TODO: get rid of routing param for page
// TODO: update last read page
// TODO: read in state when linking/pushing to this component
// TODO: how do I handle jumping on initial load?

// Because hooks rely on call order, it's easier to have the parent component guarantee
// that props passed to this component are non-null.

type Props = {
  mangaInfo: Manga,
  chapter: ChapterType,
  pageCount: number,
  prevChapter: ?ChapterType,
  nextChapter: ?ChapterType
};

type RouterProps = {
  history: { push: Function }
};

const useStyles = makeStyles({
  page: {
    width: "100%",
    marginBottom: 80
  },
  navButtonsParent: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 40
  },
  topOffset: {
    marginTop: 144
  }
});

const SinglePageReader2 = ({
  mangaInfo,
  chapter,
  pageCount,
  prevChapter,
  nextChapter,
  history: { push }
}: Props & RouterProps) => {
  const classes = useStyles();
  const urlPrefix = useContext(UrlPrefixContext);

  // TODO: when do you account jumping page / initial page jump?
  const [page, setPage] = useState(0);

  const pageCounts = useSelector(selectPageCounts);

  const prevChapterUrl =
    prevChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, prevChapter.id)
      : null;

  const nextChapterUrl =
    nextChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, nextChapter.id)
      : null;

  const handleJumpToPage = (newPage: number) => {
    setPage(newPage);
  };

  const hasNextPage =
    page < pageCount - 1 || (page === pageCount - 1 && nextChapter != null);

  const handleNextPage = useCallback(() => {
    // Wrapping function in useCallback so it can be used in useEffect.
    // Otherwise, this function reference changes on every render.
    if (page < pageCount - 1) {
      setPage(page + 1);
    }
    if (page === pageCount - 1 && nextChapter) {
      push(nextChapterUrl);
    }
  }, [nextChapter, nextChapterUrl, page, pageCount, push]);

  const hasPrevPage = page > 0 || (page === 0 && prevChapter != null);

  const handlePrevPage = useCallback(() => {
    // Wrapping function in useCallback so it can be used in useEffect.
    // Otherwise, this function reference changes on every render.
    if (page > 0) {
      setPage(page - 1);
    }
    if (page === 0 && prevChapter) {
      // If on the first page, go to the previous chapter's last page (if info available)
      const prevPageCount: ?number = pageCounts[prevChapter.id];
      const lastPage = prevPageCount ? prevPageCount - 1 : 0;

      push(prevChapterUrl);
      // TODO: pass lastPage as state when pushing
    }
  }, [page, pageCounts, prevChapter, prevChapterUrl, push]);

  useEffect(() => {
    function handleKeyDown(event: SyntheticKeyboardEvent<>) {
      const LEFT_ARROW = 37;
      const RIGHT_ARROW = 39;

      // TODO: is this the expected direction the arrows should take you?
      if (event.keyCode === LEFT_ARROW) {
        handlePrevPage();
      } else if (event.keyCode === RIGHT_ARROW) {
        handleNextPage();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextPage, handlePrevPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mangaInfo.id, chapter.id, page]);

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
        onJumpToPage={handleJumpToPage}
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

export default withRouter(SinglePageReader2);
