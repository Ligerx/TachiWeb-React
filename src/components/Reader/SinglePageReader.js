// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ResponsiveGrid from 'components/ResponsiveGrid';
import ScrollToTop from 'components/ScrollToTop';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ImageWithLoader from 'components/Reader/ImageWithLoader';
import { withRouter } from 'react-router-dom';
import Link from 'components/Link';
import ReaderOverlay from 'components/Reader/ReaderOverlay';
import { Client } from 'api';

// TODO: add some spacing around the nav buttons
// TODO: evenly space them?

// TODO: add instructions on how to use reader
//       e.g. keyboard actions, clicking on the image

// TODO: add a way to go back via keyboard? I'm thinking esc key would be good.

// TODO: what's a good maxWidth for the image?

// Left and right arrow key press will change the page
//
// References for key press events
// https://stackoverflow.com/questions/29069639/listen-to-keypress-for-document-in-reactjs
// https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

const styles = {
  page: {
    width: '100%',
    marginBottom: 80,
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

  // overlay props
  title: string,
  chapterNum: number,
  pageCount: number,
  page: number,
  backUrl: string,
  prevChapterUrl: ?string,
  nextChapterUrl: ?string,

  // overlap jump page props
  urlPrefix: string,
  mangaId: number,
  chapterId: number,

  // reader props
  imageSource: string,
  alt: string,
  nextPageUrl: ?string,
  prevPageUrl: ?string,

  // react router props
  history: {
    push: Function,
  },
};

class SinglePageReader extends Component<Props> {
  componentDidMount() {
    // flow doesn't play nice with document.addEventListener() or removeEventListener()
    // $FlowFixMe
    document.addEventListener('keydown', this.handleArrowKeyDown);
  }

  componentWillUnmount() {
    // $FlowFixMe
    document.removeEventListener('keydown', this.handleArrowKeyDown);
  }

  handleJumpToPage = (newPage: number) => {
    const { urlPrefix, mangaId, chapterId } = this.props;
    this.props.history.push(Client.page(urlPrefix, mangaId, chapterId, newPage));
  };

  handleArrowKeyDown = (event: SyntheticKeyboardEvent<>) => {
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;

    const { nextPageUrl, prevPageUrl } = this.props;

    // TODO: is this the expected direction the arrows should take you?
    if (event.keyCode === LEFT_ARROW && prevPageUrl) {
      this.props.history.push(prevPageUrl);
    } else if (event.keyCode === RIGHT_ARROW && nextPageUrl) {
      this.props.history.push(nextPageUrl);
    }
  };

  render() {
    const {
      classes,
      title,
      chapterNum,
      pageCount,
      page,
      backUrl,
      prevChapterUrl,
      nextChapterUrl,
      imageSource,
      alt,
      nextPageUrl,
      prevPageUrl,
    } = this.props;

    return (
      <>
        <ScrollToTop />

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

        <ResponsiveGrid className={classes.topOffset}>
          <Grid item xs={12}>
            <Link to={nextPageUrl}>
              <ImageWithLoader src={imageSource} className={classes.page} alt={alt} />
            </Link>
          </Grid>

          <Grid item xs={12} className={classes.navButtonsParent}>
            <Button component={Link} to={prevPageUrl} disabled={!prevPageUrl}>
              <Icon>navigate_before</Icon>
              Previous Page
            </Button>
            <Button component={Link} to={nextPageUrl} disabled={!nextPageUrl}>
              Next Page
              <Icon>navigate_next</Icon>
            </Button>
          </Grid>
        </ResponsiveGrid>
      </>
    );
  }
}

export default withRouter(withStyles(styles)(SinglePageReader));
