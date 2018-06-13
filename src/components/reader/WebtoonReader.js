// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ImageWithLoader from 'components/reader/ImageWithLoader';
import type { ChapterType } from 'types';
import { Server, Client } from 'api';
import { withRouter } from 'react-router-dom';
import Link from 'components/Link';
import Waypoint from 'react-waypoint';

// Waypoints that wrap around components require special code
// However, it automatically works with normal elements like <div>
// So I'm wrapping <ImageWithLoader> with <div>
// https://github.com/brigade/react-waypoint#children

// There's no built in way to get information on what element fired Waypoint onEnter/onLeave
// need to use anonymous functions to work around this
// https://github.com/brigade/react-waypoint/issues/160

// I'm using pagesToLoad to lazy load so I don't request every page from the server at once.
// It's currently using the same number of pages to load ahead as ImagePreloader.
// I'm not sure if both components requesting images at the same time is causing inefficiencies.
//
// From my basic testing (looking at the console Network tab), this doesn't seem to be the case.
// Only 1 request is being sent per image.

// When you chance chapter, the chapterId in the URL changes.
// This triggers the next page to render, THEN componentDidUpdate() runs.
// I'm using each image's source URL as a key to determine if it should start loading.
// I was previously just using the page #, but all the images were rendering
// before componentDidUpdate() could clear pagesToLoad.

// TODO: Might have to do custom <ScrollToTop /> behavior specifically for this reader

// FIXME: (at least in dev) there seems to be some lag when the URL changes
//        Also, a possibly related minor issue where spinners will reset when page changes
//
//        I believe these are related to the component updated on URL change
//        Should be fixable using shouldComponentUpdate()

const styles = {
  page: {
    width: '100%',
  },
  navButtonsParent: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  topOffset: {
    marginTop: 144,
  },
};

type Props = {
  classes: Object, // styles
  urlPrefix: string,
  mangaId: number,
  pageCount: number,
  chapter: ChapterType,
  nextChapterUrl: string,
  prevChapterUrl: string,

  // React router props
  match: Object,
  history: Object,
};

type State = {
  pagesInView: Array<number>, // make sure to always keep this sorted
  pagesToLoad: Array<string>, // urls for the image, acts as a unique key
};

class WebtoonReader extends Component<Props, State> {
  state = {
    pagesInView: [],
    pagesToLoad: [],
  };

  // NOTE: not currently to check if the mangaId in the URL changed
  //       don't think this is a problem
  componentDidUpdate(prevProps, prevState) {
    const {
      urlPrefix, mangaId, chapter, match, history,
    } = this.props;

    const { pagesInView } = this.state;
    const { pagesInView: prevPagesInView } = prevState;

    // Scroll to top when the chapter changes
    // TODO: make this custom scroll-to-top into it's own component
    //       maybe even make it customizable to whatever params you want to use
    const chapterChanged = match.params.chapterId !== prevProps.match.params.chapterId;
    if (chapterChanged) {
      window.scrollTo(0, 0);

      // Also reset state
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ pagesInView: [], pagesToLoad: [] });
      /* eslint-enable react/no-did-update-set-state */
    }

    // If the url changes to a page outside of view, jump to it
    // FIXME: will this cause problems with the logic below it (changing history based on url?)
    const pageNotInView = !pagesInView.includes(parseInt(match.params.page, 10));
    if (pageNotInView && !chapterChanged) {
      this.handlePageJump(match.params.page);
    }

    // Update the URL to reflect what page the user is currently looking at
    // NOTE: It seems that if you rapidly scroll, page becomes undefined and breaks rc-slider
    //       Also, on hot-reload or debug mode reload, lastPage is undefined.
    //       ^ would cause an infinite loop when I wasn't checking if lastpage != null
    const lastPage = pagesInView[pagesInView.length - 1];
    const prevLastPage = prevPagesInView[prevPagesInView.length - 1];

    // if (lastPage != null && lastPage !== prevLastPage) {
    //   history.replace(urlPrefix + Client.page(mangaId, chapter.id, lastPage));
    // }
  }

  handlePageJump = (pageId: string) => {
    const page = document.getElementById(pageId);
    if (page) window.scrollTo(0, page.offsetTop);
  };

  pageOnEnter = (page) => {
    const numLoadAhead = 3;
    const { mangaId, chapter, pageCount } = this.props;

    this.setState((prevState) => {
      // Update pagesInView
      const pagesCopy = prevState.pagesInView.slice();
      pagesCopy.push(page);
      const newPagesInView = pagesCopy.sort();

      // Add more images that can start loading
      const newPagesToLoad = addMorePagesToLoad(
        mangaId,
        chapter.id,
        numLoadAhead,
        pageCount,
        newPagesInView,
        prevState.pagesToLoad,
      );

      return {
        pagesInView: newPagesInView,
        pagesToLoad: newPagesToLoad,
      };
    });
  };

  pageOnLeave = (page) => {
    this.setState((prevState) => {
      const { pagesInView } = prevState;
      return {
        pagesInView: pagesInView.filter(pageInView => pageInView !== page),
      };
    });
  };

  render() {
    const {
      classes, mangaId, chapter, pageCount, nextChapterUrl, prevChapterUrl,
    } = this.props;
    const { pagesToLoad } = this.state;

    const sources = createImageSrcArray(mangaId, chapter.id, pageCount);

    return (
      <React.Fragment>
        <ResponsiveGrid spacing={0} className={classes.topOffset}>
          {sources.map((source, index) => (
            <Grid item xs={12} key={source} id={index}>
              <Waypoint
                onEnter={() => this.pageOnEnter(index)}
                onLeave={() => this.pageOnLeave(index)}
              >
                <div> {/* Refer to notes on Waypoint above for why this <div> is necessary */}
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
            <Button component={Link} to={prevChapterUrl} disabled={!prevChapterUrl}>
              <Icon>navigate_before</Icon>
              Previous Chapter
            </Button>
            <Button component={Link} to={nextChapterUrl} disabled={!nextChapterUrl}>
              Next Chapter
              <Icon>navigate_next</Icon>
            </Button>
          </Grid>
        </ResponsiveGrid>
      </React.Fragment>
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

// Adds the next img sources to load to the current array of img sources to load
function addMorePagesToLoad(mangaId, chapterId, numLoadAhead, pageCount, pagesInView, oldArray) {
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

export default withRouter(withStyles(styles)(WebtoonReader));
