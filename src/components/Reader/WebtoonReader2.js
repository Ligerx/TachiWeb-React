// @flow
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef
} from "react";
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

// TODO: lazy loading images, account for page jumps
// TODO: state should hold an array of pages
// TODO: jumping should be put the target page to the top of the viewport
// TODO: initializing start page should only jump if non 0
// TODO: still need to update reading status behavior
// TODO: reading status follows top page in view, but if bottom page comes into view, use that instead
// TODO: update reading status hook to support the above behavior?
// TODO: try to keep an array of refs instead of using #ids

// It's easier to have the parent component pass non-null props to avoid null checking.
// Hooks rely on call order which makes null checking somewhat painful.

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

  const topPageInView = pagesInView[0];

  const prevChapterUrl =
    prevChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, prevChapter.id)
      : null;

  const nextChapterUrl =
    nextChapter != null
      ? Client.chapter(urlPrefix, mangaInfo.id, nextChapter.id)
      : null;

  const handleJumpToPage = (jumpToPage: number) => {
    // TODO
  };

  const handlePageEnter = (index: number) => {
    return () => {
      setPagesInView(prevPagesInView => [...prevPagesInView, index].sort());
    };
    // const { mangaId, chapter, pageCount } = this.props;
    // this.setState(prevState => {
    //   const newPagesInView = addAPageInView(prevState.pagesInView, page);
    //   const newPagesToLoad = addMorePagesToLoad(
    //     mangaId,
    //     chapter.id,
    //     numLoadAhead,
    //     pageCount,
    //     newPagesInView,
    //     prevState.pagesToLoad
    //   );
    //   // This assumes that scrollToPage() always tries to put the target image at the top
    //   const isJumping = prevState.jumpingToPage !== null;
    //   const targetPageIsOnTop = newPagesInView[0] === prevState.jumpingToPage;
    //   if (isJumping && !targetPageIsOnTop) {
    //     return { pagesInView: newPagesInView };
    //   }
    //   if (isJumping && targetPageIsOnTop) {
    //     return {
    //       pagesInView: newPagesInView,
    //       pagesToLoad: newPagesToLoad,
    //       jumpingToPage: null
    //     };
    //   }
    //   return {
    //     pagesInView: newPagesInView,
    //     pagesToLoad: newPagesToLoad
    //   };
    // });
  };

  const handlePageLeave = (index: number) => {
    return () => {
      setPagesInView(prevPagesInView =>
        prevPagesInView.filter(page => page !== index).sort()
      );
    };
  };

  useEffect(() => {
    if (chapter.read || chapter.last_page_read === 0) return;

    // Initialize the starting page. This only runs once on first mount.
    handleJumpToPage(chapter.last_page_read);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useReaderScrollToTop(mangaInfo.id, chapter.id);

  usePagePreloader(
    mangaInfo.id,
    chapter.id,
    0,
    // page,
    pageCount,
    nextChapter ? nextChapter.id : null
  );

  useUpdateReadingStatus(mangaInfo.id, chapter.id, 0);
  // useUpdateReadingStatus(mangaInfo.id, chapter.id, page);

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
                  src={Server.image(mangaInfo.id, chapter.id, index)}
                  className={classes.page}
                  alt={`${chapter.name} - Page ${index + 1}`}
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
