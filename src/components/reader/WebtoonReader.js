// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ImageWithLoader from 'components/reader/ImageWithLoader';
import type { ChapterType } from 'types';
import { Server } from 'api';
import { Link, withRouter } from 'react-router-dom';

// Might have to do custom <ScrollToTop /> behavior specifically for this reader

// FIXME: Next/prev chapter buttons broken if that chapter doesn't exist
// react router won't take 'javascript:void(0)'.
// I believe there are also issues with giving Link to={null}
//
// This problem might be present in any other place where next/prevChapterUrl is used

const styles = {
  page: {
    width: '100%',
  },
  navButtonsParent: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40,
  },
};

type Props = {
  classes: Object, // styles
  mangaId: number,
  pageCount: number,
  chapter: ChapterType,
  nextChapterUrl: string,
  prevChapterUrl: string,
};

class WebtoonReader extends Component<Props> {
  // TODO: make this into it's own component
  //       maybe even make it customizable to whatever params you want to use
  componentDidUpdate(prevProps) {
    if (this.props.match.params.chapterId !== prevProps.match.params.chapterId) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {
      classes, mangaId, chapter, pageCount, nextChapterUrl, prevChapterUrl,
    } = this.props;

    const sources = createImageSrcArray(mangaId, chapter, pageCount);

    return (
      <React.Fragment>
        <ResponsiveGrid spacing={0}>
          {sources.map((source) => (
            <Grid item xs={12} key={source}>
              <ImageWithLoader src={source} className={classes.page} />
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
  for (let i = 0; i < pageCount; i += 1) {
    sources.push(Server.image(mangaId, chapter.id, i));
  }
  return sources;
}

export default withRouter(withStyles(styles)(WebtoonReader));
