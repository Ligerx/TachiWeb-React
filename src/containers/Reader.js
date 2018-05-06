import React, { Component } from 'react';
import { Server, Client, TWApi } from 'api';
import ReaderOverlay from 'components/ReaderOverlay';
import ReaderNavButtons from 'components/ReaderNavButtons';

// TODO: Need to request a change of API. Too many different calls required to do this one thing.
//    also, I briefly attempted to use all these API calls, but gave up part way through.
//    Should wait for API to change before trying completing this.

// TODO: eventually create a preloading component?
//       similar to this - https://github.com/mcarlucci/react-precache-img

// TODO: research if it's possible to cache too many images? If so, how do you clear old images?

// TODO: If I want an <img alt="...">, I need mangaInfo, which I don't have right now.

// TODO: FIXME: Browser doesn't seem to be pulling images from cache.
// Not sure if that's a backend header problem, browser problem, or a local development problem

// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???

// TODO: preload pages from the next chapter

// https://tylermcginnis.com/react-router-programmatically-navigate/

class Reader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageCount: 0,
    };

    this.fetchPageCount = this.fetchPageCount.bind(this);
    this.preloadImages = this.preloadImages.bind(this);
    this.handlePrevPageClick = this.handlePrevPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
  }

  componentDidMount() {
    this.fetchPageCount(this.preloadImages);
  }

  componentDidUpdate() {
    this.preloadImages();
  }

  fetchPageCount(callback) {
    const { mangaId, chapterId } = this.props.match.params;

    TWApi.Commands.PageCount.execute(
      (res) => {
        if (callback) {
          this.setState({ pageCount: res.page_count }, callback);
        } else {
          this.setState({ pageCount: res.page_count });
        }
      },
      null,
      { mangaId, chapterId },
    );
  }

  preloadImages() {
    // https://www.photo-mark.com/notes/image-preloading/
    // https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    const { mangaId, chapterId, page } = this.props.match.params;
    const { pageCount } = this.state;
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
    const { pageCount } = this.state;
    const pageInt = parseInt(page, 10);

    if (pageInt < pageCount - 1) {
      this.props.history.push(Client.pageUrl(mangaId, chapterId, pageInt + 1));
    } else if (pageInt === pageCount - 1) {
      // TODO: Navigate to next chapter page 0
    }
    // TODO: handle edge case
  }

  render() {
    const { mangaId, chapterId, page } = this.props.match.params;
    const { pageCount } = this.state.pageCount;

    const image = {
      height: '100%',
      backgroundImage: `url(${Server.image(mangaId, chapterId, page)})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
      backgroundSize: 'contain',
    };

    return (
      <React.Fragment>
        <ReaderOverlay mangaId={mangaId} chapterId={chapterId} page={page} pageCount={pageCount} />
        <ReaderNavButtons
          onPrevPageClick={this.handlePrevPageClick}
          onNextPageClick={this.handleNextPageClick}
        />
        <div style={image} />
      </React.Fragment>
    );
  }
}

export default Reader;
