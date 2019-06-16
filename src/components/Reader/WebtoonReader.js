/* eslint-disable react/no-unused-state */ // jumpingToPage is used internally
// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ResponsiveGrid from "components/ResponsiveGrid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import ImageWithLoader from "components/Reader/ImageWithLoader";
import type { ChapterType } from "types";
import { Server, Client } from "api";
import { withRouter } from "react-router-dom";
import Link from "components/Link";
import Waypoint from "react-waypoint";
import ReaderOverlay from "components/Reader/ReaderOverlay";

// Waypoints that wrap around components require special code
// However, it automatically works with normal elements like <div>
// https://github.com/brigade/react-waypoint#children

// There's no built in way to get information on what element fired Waypoint onEnter/onLeave
// using anonymous functions to work around this
// https://github.com/brigade/react-waypoint/issues/160

// I'm using pagesToLoad to lazy load so I don't request every page from the server at once.
// It's currently using the same number of pages to load ahead as ImagePreloader.
// From a quick look at the console Network tab, they don't seem to be interfering.

// When you change chapter, the chapterId in the URL changes.
// This triggers the next page to render, THEN componentDidUpdate() runs.

// I'm using each image's source URL as a key to determine if it should start loading.

// (browser quirks) When jumping pages, the events and state play out in a weird order.
// 1) all the current pages in view trigger their handlePageLeave() event.
// 2) next page page triggers handlePageEnter() then handlePageLeave() before the subsequent pages
//
// Because of how quirky the events are, I don't need to check if I successfully scrolled the
// target page to the top of the screen, requiring additional page loading logic

// TODO: have some sort of interaction where you go to the next chapter if you keep scrolling down
//       sort of similar to the idea of keyboard interactions, don't rely on mouse clicks

// TODO: make the image transition in size, hopefully that'll make page loading less jumpy
//       Unsure if there's any side effects of doing so
//
//       One alternative plan if this doesn't work well is to have the Image pass it's delta height
//       and scroll around based on that. However, this seems a lot more tricky to get right.

const styles = {
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
};

type Props = {
  classes: Object, // styles

  // overlay specific props
  title: string,
  chapterNum: number,
  page: number,
  backUrl: string,
  urlPrefix: string,

  // reader props
  mangaId: number,
  pageCount: number,
  chapter: ChapterType,
  nextChapterUrl: string,
  prevChapterUrl: string,

  // React router props
  match: Object,
  history: Object
};

type State = {
  pagesInView: Array<number>, // make sure to always keep this sorted
  pagesToLoad: Array<string>, // urls for the image, acts as a unique key
  jumpingToPage: ?number // using to prevent loading skipped images when jumping pages
};

const numLoadAhead = 3;

class WebtoonReader extends Component<Props, State> {
  state = {
    pagesInView: [],
    pagesToLoad: [],
    jumpingToPage: null
  };

  componentDidMount() {
    const { match } = this.props;
    const page = parseInt(match.params.page, 10);

    if (page === 0) {
      window.scrollTo(0, 0);
    } else {
      // If you're directly loading a specific page number, jump to it
      // NOTE: scrolling finished before waypoints are instantiated, so no events are triggered
      scrollToPage(parseInt(match.params.page, 10));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { match } = this.props;
    const chapterChanged =
      match.params.chapterId !== prevProps.match.params.chapterId;

    if (chapterChanged) {
      this.resetForNewChapter();
    }

    // When pagesInView state is changed, check if URL should be updated
    this.updateUrlToCurrentPage(prevState);
  }

  resetForNewChapter = () => {
    // Purposely not jumping to new chapter's last read page
    window.scrollTo(0, 0);
    this.setState({ pagesInView: [], pagesToLoad: [], jumpingToPage: null });
  };

  updateUrlToCurrentPage = prevState => {
    // This is a helper function, call from componentDidUpdate()
    //
    // NOTE: It seems that if you rapidly scroll, page becomes undefined.
    //       Also, on hot-reload or debug mode reload, lastPage is undefined.
    //       This would cause an infinite loop when I wasn't checking if lastpage != null.
    const { urlPrefix, mangaId, chapter, history } = this.props;
    const { pagesInView } = this.state;
    const { pagesInView: prevPagesInView } = prevState;

    const lastPage = pagesInView[pagesInView.length - 1];
    const prevLastPage = prevPagesInView[prevPagesInView.length - 1];

    if (lastPage != null && lastPage !== prevLastPage) {
      history.replace(Client.page(urlPrefix, mangaId, chapter.id, lastPage));
    }
  };

  handleJumpToPage = (newPage: number) => {
    this.setState({ jumpingToPage: newPage });

    // Thought I might need to put this in setState's callback function, but it
    // doesn't seem to be causing any problems like this
    scrollToPage(newPage);
  };

  handlePageEnter = page => {
    const { mangaId, chapter, pageCount } = this.props;

    this.setState(prevState => {
      const newPagesInView = addAPageInView(prevState.pagesInView, page);
      const newPagesToLoad = addMorePagesToLoad(
        mangaId,
        chapter.id,
        numLoadAhead,
        pageCount,
        newPagesInView,
        prevState.pagesToLoad
      );

      // This assumes that scrollToPage() always tries to put the target image at the top
      const isJumping = prevState.jumpingToPage !== null;
      const targetPageIsOnTop = newPagesInView[0] === prevState.jumpingToPage;

      if (isJumping && !targetPageIsOnTop) {
        return { pagesInView: newPagesInView };
      }
      if (isJumping && targetPageIsOnTop) {
        return {
          pagesInView: newPagesInView,
          pagesToLoad: newPagesToLoad,
          jumpingToPage: null
        };
      }

      return {
        pagesInView: newPagesInView,
        pagesToLoad: newPagesToLoad
      };
    });
  };

  handlePageLeave = page => {
    this.setState(prevState => {
      const { pagesInView } = prevState;
      return {
        pagesInView: pagesInView.filter(pageInView => pageInView !== page)
      };
    });
  };

  render() {
    const {
      classes,
      title,
      chapterNum,
      page,
      backUrl,
      mangaId,
      chapter,
      pageCount,
      nextChapterUrl,
      prevChapterUrl
    } = this.props;
    const { pagesToLoad } = this.state;

    const sources = createImageSrcArray(mangaId, chapter.id, pageCount);

    return (
      <>
        <ReaderOverlay
          title={title}
          chapterNum={chapterNum}
          pageCount={pageCount}
          page={page}
          backUrl={backUrl}
          prevChapterUrl={prevChapterUrl}
          nextChapterUrl={nextChapterUrl}
          onJumpToPage={this.handleJumpToPage}
        />

        <ResponsiveGrid spacing={0} className={classes.topOffset}>
          {sources.map((source, index) => (
            <Grid item xs={12} key={source} id={index}>
              <Waypoint
                onEnter={() => this.handlePageEnter(index)}
                onLeave={() => this.handlePageLeave(index)}
              >
                <div>
                  {" "}
                  {/* Refer to notes on Waypoint above for why this <div> is necessary */}
                  <ImageWithLoader
                    src={pagesToLoad.includes(source) ? source : null}
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
  }
}

// Helper functions
function createImageSrcArray(mangaId, chapterId, pageCount) {
  const sources = [];
  for (let page = 0; page < pageCount; page += 1) {
    sources.push(Server.image(mangaId, chapterId, page));
  }
  return sources;
}

function addAPageInView(oldPagesInView, newPage) {
  const pagesCopy = oldPagesInView.slice();
  pagesCopy.push(newPage);
  return pagesCopy.sort((a, b) => a - b);
}

// Adds the next img sources to load to the current array of img sources to load
function addMorePagesToLoad(
  mangaId,
  chapterId,
  numLoadAhead,
  pageCount,
  pagesInView,
  oldArray
) {
  if (!pagesInView.length) return oldArray; // pages can sometimes be empty if scrolling too fast

  const newPages = [];
  for (let i = 0; i < numLoadAhead + pagesInView.length; i += 1) {
    // includes the current pages just to be safe
    if (pagesInView[0] + i < pageCount) {
      newPages.push(Server.image(mangaId, chapterId, pagesInView[0] + i));
    }
  }

  const arrayCopy = oldArray.slice();
  arrayCopy.push(...newPages);

  return [...new Set(arrayCopy)]; // unique values only
}

function scrollToPage(pageNum: number) {
  // If an image's height is less than the vh, scrolling to it will cause the subsequent page
  // to be the page-in-view. This will make the URL change to that next page.
  // This will also make the ReaderOverlay current page jump to that next page.
  //
  // However, this is intentional so that jumping to a page is consistent and predictable.
  // This guarantees that you will load the target image and no image before it
  // (unless you hit the bottom of the page)

  const page = document.getElementById(pageNum.toString()); // this is the <Grid> wrapping element
  if (!page) return;

  // Adding extra pixels to ensure the previous page isn't still in view. (browser quirk)
  window.scrollTo(0, page.offsetTop + 1);
}

export default withRouter(withStyles(styles)(WebtoonReader));
