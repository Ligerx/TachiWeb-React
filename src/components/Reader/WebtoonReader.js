// @flow
import React, { useState, useEffect, useContext, useRef } from "react";
import { Helmet } from "react-helmet";
import { times } from "lodash";
import type { Manga } from "@tachiweb/api-client";
import type { ChapterType } from "types";
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
import Link from "components/Link";
import Waypoint from "react-waypoint";
import {
  usePagePreloader,
  useUpdateReadingStatus,
  useReaderScrollToTop
} from "components/Reader/utils";

// It's easier to have the parent component pass non-null props to avoid null checking.
// Hooks rely on call order which makes null checking somewhat painful.

// I considered using refs to store all images to scroll to.
// However, this seems to be quite complicated because I'd have to somehow update the
// data when chapter (and thus the page count) changes if I use useRef(). This seems quite annoying because
// child components only update refs on mount and unmount, so I can't just have an array of refs update outside of useRef().
// Sticking with ids is a much easier to write and understand solution.
// https://stackoverflow.com/questions/54940399/how-target-dom-with-react-useref-in-map
// https://stackoverflow.com/questions/55995760/how-to-add-refs-dynamically-with-react-hooks
// https://dev.to/ajsharp/-an-array-of-react-refs-pnf

// https://github.com/civiccc/react-waypoint/issues/202
// Jumping backwards does not fire waypoint events in the expected order. See the above issue ^
// The consequence of this is since I'm expecting the destination page entering to resume normal
// side effects, these effects will run on every page going backwards (possibly out of order).
//
// It TECHNICALLY works, but it feels wrong...
//
// One way around this is to use smooth scrolling. This seems to slow down scrolling enough
// that events fire in the expected order. Not sure if this is desirable.
// This works in normal usage, but if you use debugging breakpoints the above issue appears again.

// Waypoints that wrap around components require special code
// However, it automatically works with normal elements like <div>
// https://github.com/brigade/react-waypoint#children

type Props = {
  mangaInfo: Manga,
  chapter: ChapterType,
  pageCount: number,
  prevChapter: ?ChapterType,
  nextChapter: ?ChapterType
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

function scrollToPage(pageNum: number) {
  const page = document.getElementById(pageNum.toString()); // this is the <Grid> wrapping element
  if (!page) return;

  // Adding extra pixels to ensure the previous page isn't still in view. (browser quirk)
  window.scrollTo({ top: page.offsetTop + 1, behavior: "smooth" });
}

const WebtoonReader = ({
  mangaInfo,
  chapter,
  pageCount,
  prevChapter,
  nextChapter
}: Props) => {
  const classes = useStyles();
  const urlPrefix = useContext(UrlPrefixContext);

  // Keep pagesInView sorted
  const [pagesInView, setPagesInView] = useState<Array<number>>([]);

  // Use jumpToPageRef to know when you are jumping and when you reached your destination
  const jumpToPageRef = useRef<?number>(null);

  const prevChapterUrl =
    prevChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, prevChapter.id)
      : null;

  const nextChapterUrl =
    nextChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, nextChapter.id)
      : null;

  const handleJumpToPage = (pageNum: number) => {
    jumpToPageRef.current = pageNum;
    scrollToPage(pageNum);
  };

  const handlePageEnter = (index: number) => {
    return () => {
      // Clear page jump ref when we've reached our destination page
      if (jumpToPageRef.current === index) {
        jumpToPageRef.current = null;
      }

      setPagesInView(prevPagesInView => [...prevPagesInView, index].sort());
    };
  };

  const handlePageLeave = (index: number) => {
    return () => {
      setPagesInView(prevPagesInView =>
        prevPagesInView.filter(page => page !== index).sort()
      );
    };
  };

  useReaderScrollToTop(mangaInfo.id, chapter.id);

  // Order matters, this useEffect should happen after useReaderScrollToTop()
  useEffect(() => {
    if (chapter.read || chapter.last_page_read === 0) return;

    // Initialize the starting page. This only runs once on first mount.
    handleJumpToPage(chapter.last_page_read);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const topPageInView: ?number = pagesInView[0];
  const lastPageInView: ?number = pagesInView[pagesInView.length - 1];

  usePagePreloader(
    mangaInfo.id,
    chapter.id,
    lastPageInView, // Currently not preloading other in view pages
    pageCount,
    nextChapter ? nextChapter.id : null,
    jumpToPageRef.current != null
  );

  // useUpdateReadingStatus() only takes 1 page currently
  // The intended behavior is if the final page comes into view, mark the chapter as
  // complete, but otherwise track reading status based on the topPageInView.
  const readingStatusPage =
    lastPageInView === pageCount - 1 ? lastPageInView : topPageInView;

  useUpdateReadingStatus(
    mangaInfo.id,
    chapter.id,
    readingStatusPage,
    jumpToPageRef.current != null
  );

  return (
    <>
      <Helmet
        title={`${mangaInfo.title} - Ch. ${chapterNumPrettyPrint(
          chapter.chapter_number
        )}, Pg. ${topPageInView + 1} TachiWeb`}
      />

      <ReaderOverlay
        title={mangaInfo.title}
        chapterNum={chapter.chapter_number}
        pageCount={pageCount}
        page={topPageInView}
        backUrl={Client.manga(urlPrefix, mangaInfo.id)}
        prevChapterUrl={prevChapterUrl}
        nextChapterUrl={nextChapterUrl}
        onJumpToPage={handleJumpToPage}
      />

      <ResponsiveGrid spacing={0} className={classes.topOffset}>
        {times(pageCount).map((_, index) => (
          <Grid
            item
            xs={12}
            key={`${mangaInfo.id}-${chapter.id}-${index}`}
            id={index}
          >
            <Waypoint
              onEnter={handlePageEnter(index)}
              onLeave={handlePageLeave(index)}
            >
              <div>
                {/* Refer to notes on Waypoint above for why this <div> is necessary */}
                <ImageWithLoader
                  className={classes.page}
                  src={Server.image(mangaInfo.id, chapter.id, index)}
                  alt={`${chapter.name} - Page ${index + 1}`}
                  lazyLoad
                  preventLoading={jumpToPageRef.current != null}
                />
              </div>
            </Waypoint>
          </Grid>
        ))}

        <Grid item xs={12} className={classes.navButtonsParent}>
          <Button
            component={Link}
            to={prevChapterUrl}
            disabled={!prevChapterUrl}
          >
            <Icon>navigate_before</Icon>
            Previous Chapter
          </Button>
          <Button
            component={Link}
            to={nextChapterUrl}
            disabled={!nextChapterUrl}
          >
            Next Chapter
            <Icon>navigate_next</Icon>
          </Button>
        </Grid>
      </ResponsiveGrid>
    </>
  );
};

export default WebtoonReader;
