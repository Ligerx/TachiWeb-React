import React, { Component } from 'react';
import TWApi from 'api';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

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

    const image = {
      height: '100%',
      backgroundImage: `url(${imageUrl(mangaId, chapter, page)})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
      backgroundSize: 'contain',
    };

    const button = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    };

    const test = {
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 5,
    };

    return (
      <React.Fragment>
        <div style={test}>
          <IconButton
            component={Link}
            to={pageUrl(mangaId, chapter, parseInt(page, 10) - 1)}
            style={button}
          >
            <Icon>navigate_before</Icon>
          </IconButton>
          <IconButton
            component={Link}
            to={pageUrl(mangaId, chapter, parseInt(page, 10) + 1)}
            style={{ ...button, right: 0 }}
          >
            <Icon>navigate_next</Icon>
          </IconButton>

          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="title" color="inherit">
                Title
              </Typography>
            </Toolbar>
          </AppBar>

          <h2>{this.state.pageCount}</h2>
          <h3>{`MangaId: ${mangaId}, Chapter: ${chapter}, Page ${page}`}</h3>
          {/* <img src={imageUrl(mangaId, chapter, page)} style={style} /> */}
        </div>

        <div style={image} />
      </React.Fragment>
    );
  }
}

export default Reader;
