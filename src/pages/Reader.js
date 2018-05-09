import React, { Component } from 'react';
import { Server, Client } from 'api';
import ReaderOverlay from 'components/ReaderOverlay';
import ReaderNavButtons from 'components/ReaderNavButtons';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import PageSlider from 'components/PageSlider';

// TODO: in the Url, page # is 0 index. Change it to 1 index for readability.
//       you'll also have to change the linking in API and possibly other places.

// TODO: If I want an <img alt="...">, I need mangaInfo, which I don't have right now.

// TODO: eventually create a preloading component?
//       similar to this - https://github.com/mcarlucci/react-precache-img
// TODO: research if it's possible to cache too many images? If so, how do you clear old images?
// TODO: FIXME: Browser doesn't seem to be pulling images from cache.
// Not sure if that's a backend header problem, browser problem, or a local development problem
// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???
// TODO: preload pages from the next chapter

// TODO: allow keyboard commands for reading

// TODO: update server about last read page and finished reading

// TODO: just realized that when you finish chapters (or mark as unread),
//       I need to keep the chapters data up to date or the Library's unread chapters will be stale

// https://tylermcginnis.com/react-router-programmatically-navigate/

const styles = {
  // Need to set the backgroundImage url as well
  mangaImage: {
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
  },
};

class Reader extends Component {
  constructor(props) {
    super(props);

    this.preloadImages = this.preloadImages.bind(this);
    this.handlePrevPageClick = this.handlePrevPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    // this.handlePrevChapterClick = this.handlePrevChapterClick.bind(this);
    // this.handleNextChapterClick = this.handleNextChapterClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchChapters();
    this.props.fetchPageCount();
  }

  componentDidUpdate() {
    this.preloadImages();

    this.props.fetchLibrary();
    this.props.fetchChapters();
    this.props.fetchPageCount();
  }

  preloadImages() {
    // https://www.photo-mark.com/notes/image-preloading/
    // https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    const {
      mangaInfo, chapter, pageCount, page,
    } = this.props;
    const pageInt = parseInt(page, 10); // params are always strings, string -> int
    const numPreload = 3; // Currently preloading 3 images ahead

    for (let i = 1; i <= numPreload; i += 1) {
      if (parseInt(pageInt, 10) + i < pageCount) {
        // Chrome would only preload if a new image object was used every time
        const image = new Image();
        image.src = Server.image(mangaInfo.id, chapter.id, pageInt + i);
      }
    }
  }

  handlePrevPageClick() {
    const {
      mangaInfo, chapter, page, prevChapterId,
    } = this.props;
    const pageInt = parseInt(page, 10);

    if (pageInt > 0) {
      this.props.history.push(Client.page(mangaInfo.id, chapter.id, pageInt - 1));
    } else if (pageInt === 0 && prevChapterId) {
      this.props.history.push(Client.page(mangaInfo.id, prevChapterId, 0));
    }
  }

  handleNextPageClick() {
    const {
      mangaInfo, chapter, pageCount, page, nextChapterId,
    } = this.props;
    const pageInt = parseInt(page, 10);

    if (pageInt < pageCount - 1) {
      this.props.history.push(Client.page(mangaInfo.id, chapter.id, pageInt + 1));
    } else if (pageInt === pageCount - 1 && nextChapterId) {
      this.props.history.push(Client.page(mangaInfo.id, nextChapterId, 0));
    }
  }

  // handlePrevChapterClick() {
  //   // TODO: Ideally this would put you on the LAST page of the previous chapter.
  //   //       Would need to first have the previous chapter's pageCount to do so.
  //   const { mangaInfo, chapters, chapter, prevChapterId } = this.props;
  //   this.props.history.push(Client.page(mangaInfo.id, prevChapterId, 0));
  // }
  // handleNextChapterClick() {
  //   const { mangaInfo, chapters, chapter, nextChapterId } = this.props;
  //   this.props.history.push(Client.page(mangaInfo.id, nextChapterId, 0));
  // }

  render() {
    const {
      mangaInfo, chapters, chapter, pageCount, page, classes, prevChapterId, nextChapterId,
    } = this.props;

    if (!mangaInfo || !chapters.length || !chapter || !pageCount) {
      // TODO: use loading spinner in the cases where that's relevant
      return null;
    }

    const backgroundImageStyle = {
      backgroundImage: `url(${Server.image(mangaInfo.id, chapter.id, page)})`,
    };

    return (
      <React.Fragment>
        <ReaderOverlay
          title={mangaInfo.title}
          chapterNum={chapter.chapter_number}
          pageCount={pageCount}
          mangaId={mangaInfo.id}
        >
          <PageSlider
            mangaId={mangaInfo.id}
            chapterId={chapter.id}
            pageCount={pageCount}
            page={page}
            prevChapterId={prevChapterId}
            nextChapterId={nextChapterId}
          />
        </ReaderOverlay>
        <ReaderNavButtons
          onPrevPageClick={this.handlePrevPageClick}
          onNextPageClick={this.handleNextPageClick}
        />
        <div
          className={classes.mangaImage}
          style={backgroundImageStyle}
        />
      </React.Fragment>
    );
  }
}

Reader.propTypes = {
  mangaInfo: mangaType,
  chapters: PropTypes.arrayOf(chapterType),
  chapter: chapterType,
  pageCount: PropTypes.number,
  page: PropTypes.number.isRequired,
  prevChapterId: PropTypes.number,
  nextChapterId: PropTypes.number,
  // Redux actions
  fetchLibrary: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
  fetchPageCount: PropTypes.func.isRequired,
  // Classes is the injected styles
  classes: PropTypes.object.isRequired,
  // Below are react-router props
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

Reader.defaultProps = {
  mangaInfo: null,
  chapters: [],
  chapter: null,
  pageCount: 0,
  prevChapterId: null,
  nextChapterId: null,
};

export default withStyles(styles)(Reader);
