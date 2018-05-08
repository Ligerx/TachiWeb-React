import React, { Component } from 'react';
import { Server, Client } from 'api';
import ReaderOverlay from 'components/ReaderOverlay';
import ReaderNavButtons from 'components/ReaderNavButtons';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

// TODO: actually be able to transition to the next chapter

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

// https://tylermcginnis.com/react-router-programmatically-navigate/

const styles = {
  // Need to set the backgroundImage url as well
  mangaImage: {
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center top',
    backgroundSize: 'contain',
  },
};

class Reader extends Component {
  constructor(props) {
    super(props);

    this.preloadImages = this.preloadImages.bind(this);
    this.handlePrevPageClick = this.handlePrevPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchChapters();
    this.props.fetchPageCount();
  }

  componentDidUpdate() {
    this.preloadImages();
  }

  preloadImages() {
    // https://www.photo-mark.com/notes/image-preloading/
    // https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    const { mangaId, chapterId, page } = this.props.match.params;
    const { pageCount } = this.props;
    const pageInt = parseInt(page, 10); // params are always strings, string -> int
    const numPreload = 3; // Currently preloading 3 images ahead

    for (let i = 1; i <= numPreload; i += 1) {
      if (parseInt(pageInt, 10) + i < pageCount) {
        // Chrome would only preload if a new image object was used every time
        const image = new Image();
        image.src = Server.image(mangaId, chapterId, pageInt + i);
      }
    }
  }

  handlePrevPageClick() {
    // TODO: do all this lol
    return null;
  }

  handleNextPageClick() {
    const { mangaId, chapterId, page } = this.props.match.params;
    const { pageCount } = this.props;
    const pageInt = parseInt(page, 10);

    if (pageInt < pageCount - 1) {
      this.props.history.push(Client.page(mangaId, chapterId, pageInt + 1));
    } else if (pageInt === pageCount - 1) {
      // TODO: Navigate to next chapter page 0
    }
    // TODO: handle edge case
  }

  render() {
    const {
      mangaInfo, chapters, chapter, mangaInfoIsFetching, pageCount, classes,
    } = this.props;
    const { page } = this.props.match.params;

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
        />
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
  mangaInfoIsFetching: PropTypes.bool.isRequired,
  pageCount: PropTypes.number,
  fetchLibrary: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
  fetchPageCount: PropTypes.func.isRequired,
  // Classes is the injected styles
  classes: PropTypes.object.isRequired,
};

Reader.defaultProps = {
  mangaInfo: null,
  chapters: [],
  chapter: null,
  pageCount: 0,
};

export default withStyles(styles)(Reader);
