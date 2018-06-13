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

// TODO: Might have to do custom <ScrollToTop /> behavior specifically for this reader

// FIXME: (at least in dev) there seems to be some lag when the URL changes
//        Also, a possibly related minor issue where spinners will reset when page changes
//
//        I believe these are related to the component updated on URL change
//        Should be fixable using shouldComponentUpdate()

// FIXME: when you change chapters, the URL changes, then the render method runs again,
//        THEN componentDidUpdate() runs.
//        The problem is that the next chapter's images will already have loaded based on
//        the previous state.pagesToLoad before we have a chance to clear the array.
//
//        I considered using an onClick to intercept the next/prev chapter button click,
//        but chapter can also change when pressing the Overlap chapter skip buttons
//
//        The next best alternative I can think of is to store the actual image URL in
//        state.pagesToLoad. With this, all pages are unique, so chapter changes won't matter.
//        In fact, I don't even have to clear the array between chapter changes (if I don't want to)

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
};

type State = {
  pagesInView: Array<number>, // make sure to always keep this sorted
  pagesToLoad: Array<number>,
};

class WebtoonReader extends Component<Props, State> {
  state = {
    pagesInView: [],
    pagesToLoad: [],
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      urlPrefix, mangaId, chapter, match, history,
    } = this.props;

    const { pagesInView } = this.state;
    const { pagesInView: prevPagesInView } = prevState;

    // Scroll to top when the chapter changes
    // TODO: make this custom scroll-to-top into it's own component
    //       maybe even make it customizable to whatever params you want to use
    if (match.params.chapterId !== prevProps.match.params.chapterId) {
      window.scrollTo(0, 0);

      // Also reset state
      this.setState({ pagesInView: [], pagesToLoad: [] });
    }

    // Update the URL to reflect what page the user is currently looking at
    // NOTE: It seems that if you rapidly scroll, page becomes undefined and breaks rc-slider
    //       Also, on hot-reload or debug mode reload, lastPage is undefined.
    //       ^ would cause an infinite loop when I wasn't checking if lastpage != null
    const lastPage = pagesInView[pagesInView.length - 1];
    const prevLastPage = prevPagesInView[prevPagesInView.length - 1];

    if (lastPage != null && lastPage !== prevLastPage) {
      history.replace(urlPrefix + Client.page(mangaId, chapter.id, lastPage));
    }
  }

  pageOnEnter = (page) => {
    const numPagesLoadAhead = 3;
    const { pageCount } = this.props;

    this.setState((prevState) => {
      // Update pagesInView
      const pagesCopy = prevState.pagesInView.slice();
      pagesCopy.push(page);
      const newPagesInView = pagesCopy.sort();

      // Add more images that can start loading
      const newPagesToLoad =
        addMorePagesToLoad(numPagesLoadAhead, pageCount, newPagesInView, prevState.pagesToLoad);

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

    const sources = createImageSrcArray(mangaId, chapter, pageCount);

    return (
      <React.Fragment>
        <ResponsiveGrid spacing={0} className={classes.topOffset}>
          {sources.map((source, index) => (
            <Grid item xs={12} key={source}>
              <Waypoint
                onEnter={() => this.pageOnEnter(index)}
                onLeave={() => this.pageOnLeave(index)}
              >
                <div> {/* Refer to notes on Waypoint above for why this <div> is necessary */}
                  <ImageWithLoader
                    src={pagesToLoad.includes(index) ? source : null}
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
function createImageSrcArray(mangaId, chapter, pageCount) {
  const sources = [];
  for (let page = 0; page < pageCount; page += 1) {
    sources.push(Server.image(mangaId, chapter.id, page));
  }
  return sources;
}

function addMorePagesToLoad(numPagesLoadAhead, pageCount, pagesInView, oldArray) {
  const lastPage = pagesInView[pagesInView.length - 1];
  if (!lastPage) return oldArray; // pages can sometimes be empty if scrolling too fast

  const newPages = [...pagesInView]; // also includes the current pages just to be safe
  for (let i = 1; i <= numPagesLoadAhead; i += 1) {
    if (lastPage + i < pageCount) {
      newPages.push(lastPage + i);
    }
  }

  const arrayCopy = oldArray.slice();
  arrayCopy.push(...newPages);

  return [...new Set(arrayCopy)]; // unique values only
}

export default withRouter(withStyles(styles)(WebtoonReader));
