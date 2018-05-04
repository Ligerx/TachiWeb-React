import React, { Component } from 'react';
import TWApi from 'api';
import ReaderOverlay from 'components/ReaderOverlay';

// TODO: eventually create a preloading component?
//       similar to this - https://github.com/mcarlucci/react-precache-img

// TODO: research if it's possible to cache too many images? If so, how do you clear old images?

// TODO: If I want an <img alt="...">, I need mangaInfo, which I don't have right now.

// TODO: FIXME: Browser doesn't seem to be pulling images from cache.
// Not sure if that's a backend header problem, browser problem, or a local development problem

// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???

// server images
function imageUrl(mangaId, chapter, page) {
  return `/api/img/${mangaId}/${chapter}/${page}`;
}

class Reader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageCount: 0,
    };

    this.preloadImages = this.preloadImages.bind(this);
  }

  componentDidMount() {
    const { mangaId, chapter, page } = this.props.match.params;

    TWApi.Commands.PageCount.execute(
      (res) => {
        this.setState({ pageCount: res.page_count }, this.preloadImages);
      },
      null,
      { mangaId, chapterId: chapter },
    );
  }

  componentDidUpdate() {
    this.preloadImages();
  }

  preloadImages() {
    // https://www.photo-mark.com/notes/image-preloading/
    // https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    const { mangaId, chapter, page } = this.props.match.params;
    const { pageCount } = this.state;
    const pageInt = parseInt(page, 10); // params are always strings, string -> int
    const numPreload = 3; // Currently preloading 3 images ahead

    for (let i = 1; i <= numPreload; i += 1) {
      if (parseInt(pageInt, 10) + i < pageCount) {
        // Chrome would only preload if a new image object was used every time
        const image = new Image();
        image.src = imageUrl(mangaId, chapter, pageInt + i);
      }
    }
  }

  render() {
    const { mangaId, chapter, page } = this.props.match.params;
    const { pageCount } = this.state.pageCount;

    const image = {
      height: '100%',
      backgroundImage: `url(${imageUrl(mangaId, chapter, page)})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
      backgroundSize: 'contain',
    };

    return (
      <React.Fragment>
        <ReaderOverlay mangaId={mangaId} chapter={chapter} page={page} pageCount={pageCount} />
        <div style={image} />
      </React.Fragment>
    );
  }
}

export default Reader;
