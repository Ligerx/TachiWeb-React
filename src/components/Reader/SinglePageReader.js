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

// react-router history.location.state observations:
// state only changes when you <Link> or push() to change routes.
// Otherwise, the state is the same object between renders, so shallow equality checks work.

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

/**
 * Side effect that sets which page the user starts on initially and after changing chapters.
 *
 * 3 cases for determining a chapter's initial page.
 * 1. On initial load, jump to this chapter's last read page.
 * 2. Clicking previous page when on page 0. Jump to the previous chapter's last page.
 * 3. Going to next chapter or skipping to next/previous chapter, go to page 0.
 */
function useJumpToChapterInitialPage(
  chapterId: number, // only used to trigger useEffect when it changes
  state: ?ChapterPageLinkState,
  setPage: Function
) {
  const firstRender = useRef(true);

  // Handle setting the starting page when chapter changes
  useEffect(() => {
    if (firstRender.current) {
      // Prevent this useEffect from overwriting the useState initialized value on first mount
      firstRender.current = false;
    } else if (state != null) {
      // react-router link state changes when the URL (ie. chapter) changes
      // Jumping to the last page of the prev chapter if the link state exists
      setPage(state.jumpToPage);
    } else {
      setPage(0);
    }
  }, [chapterId, state, setPage]);
}

const SinglePageReader = ({
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

  useJumpToChapterInitialPage(chapter.id, state, setPage);

  const prevChapterUrl =
    prevChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, prevChapter.id)
      : null;

  const nextChapterUrl =
    nextChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, nextChapter.id)
      : null;

  const hasNextPage =
    page < pageCount - 1 || (page === pageCount - 1 && nextChapter != null);

  const hasPrevPage = page > 0 || (page === 0 && prevChapter != null);

  const handleNextPage = useCallback(() => {
    // Wrapping function in useCallback so it can be used in useEffect.
    // Otherwise, this function reference changes on every render.
    if (page < pageCount - 1) {
      setPage(page + 1);
    }
    if (page === pageCount - 1 && nextChapterUrl) {
      push(nextChapterUrl);
    }
  }, [nextChapterUrl, page, pageCount, push]);

  const handlePrevPage = useCallback(() => {
    // Wrapping function in useCallback so it can be used in useEffect.
    // Otherwise, this function reference changes on every render.
    if (page > 0) {
      setPage(page - 1);
    }
    if (page === 0 && prevChapterUrl) {
      // If on the first page, go to the previous chapter's last page (if info is available)
      const lastPage = prevChapterPageCount ? prevChapterPageCount - 1 : 0;

      const linkState: ChapterPageLinkState = {
        chapterId: chapter.id,
        jumpToPage: lastPage
      };

      push(prevChapterUrl, linkState);
    }
  }, [chapter.id, page, prevChapterPageCount, prevChapterUrl, push]);

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

  useReaderScrollToTop(mangaInfo.id, chapter.id, page);

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
        <Grid item xs={12}>
          <ImageWithLoader
            src={Server.image(mangaInfo.id, chapter.id, page)}
            className={classes.page}
            alt={`${chapter.name} - Page ${page + 1}`}
            onClick={handleNextPage}
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

export default withRouter(SinglePageReader);
