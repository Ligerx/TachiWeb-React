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
import { Link, withRouter } from 'react-router-dom';
import Waypoint from 'react-waypoint';

// Waypoints that wrap around components require special code
// However, it automatically works with normal elements like <div>
// So I'm wrapping <ImageWithLoader> with <div>
// https://github.com/brigade/react-waypoint#children

// There's no built in way to get information on what element fired Waypoint onEnter/onLeave
// need to use anonymous functions to work around this
// https://github.com/brigade/react-waypoint/issues/160

// TODO: Might have to do custom <ScrollToTop /> behavior specifically for this reader

// FIXME: Next/prev chapter buttons broken if that chapter doesn't exist
// react router won't take 'javascript:void(0)'.
// I believe there are also issues with giving Link to={null}
//
// This problem might be present in any other place where next/prevChapterUrl is used

// FIXME: (at least in dev) there seems to be some lag when the URL changes

const styles = {
  page: {
    width: '100%',
  },
  navButtonsParent: {
    display: 'flex',
    justifyContent: 'center',
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
};

class WebtoonReader extends Component<Props, State> {
  state = {
    pagesInView: [],
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
    }

    // Update the URL to reflect what page the user is currently looking at
    const lastPage = pagesInView[pagesInView.length - 1];
    const prevLastPage = prevPagesInView[prevPagesInView.length - 1];

    if (lastPage !== prevLastPage) {
      history.replace(urlPrefix + Client.page(mangaId, chapter.id, lastPage));
    }
  }

  pageOnEnter = (page) => {
    this.setState((prevState) => {
      const pagesCopy = prevState.pagesInView.slice();
      pagesCopy.push(page);

      return { pagesInView: pagesCopy.sort() };
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
                  <ImageWithLoader src={source} className={classes.page} />
                </div>
              </Waypoint>
            </Grid>
          ))}

          <Grid item xs={12} className={classes.navButtonsParent}>
            <Button component={Link} to={prevChapterUrl}>
              <Icon>navigate_before</Icon>
              Previous Chapter
            </Button>
            <Button component={Link} to={nextChapterUrl}>
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

export default withRouter(withStyles(styles)(WebtoonReader));
