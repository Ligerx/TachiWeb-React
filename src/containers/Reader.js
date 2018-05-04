import React, { Component } from 'react';
import TWApi from 'api';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

// TODO: eventually create a preloading component?
//       similar to this - https://github.com/mcarlucci/react-precache-img

// TODO: research if it's possible to cache too many images? If so, how do you clear old images?

// TODO: If I want an <img alt="...">, I need mangaInfo, which I don't have right now.

// NOTE: researching how caching works. I don't think I have to worry about what I actually render
//       rendering can be kept separate from preloading images
//       In fact, this might be easier than I thought. A very naive function should work just fine

// TODO: FIXME: Browser doesn't seem to be pulling images from cache.
// Not sure if that's a backend header problem, browser problem, or a local development problem

// server images
function imageUrl(mangaId, chapter, page) {
  return `/api/img/${mangaId}/${chapter}/${page}`;
}

// pages in the browser
function pageUrl(mangaId, chapter, page) {
  return `/reader/${mangaId}/${chapter}/${page}`;
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

    return (
      <div>
        <Button
          variant="raised"
          component={Link}
          to={pageUrl(mangaId, chapter, parseInt(page, 10) - 1)}
        >
          Previous
        </Button>
        <Button
          variant="raised"
          component={Link}
          to={pageUrl(mangaId, chapter, parseInt(page, 10) + 1)}
        >
          Next
        </Button>
        <h2>{this.state.pageCount}</h2>
        <h3>{`MangaId: ${mangaId}, Chapter: ${chapter}, Page ${page}`}</h3>
        <img src={imageUrl(mangaId, chapter, page)} />
      </div>
    );
  }
}

export default Reader;
