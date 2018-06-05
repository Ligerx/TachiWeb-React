// @flow
import React, { Component } from 'react';
import { Server, Client } from 'api';
import ReaderOverlay from 'components/ReaderOverlay';
import { withStyles } from '@material-ui/core/styles';
import PageSlider from 'components/PageSlider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import FullScreenLoading from 'components/loading/FullScreenLoading';
import compact from 'lodash/compact';
import type { ReaderContainerProps } from 'containers/ReaderContainer';
import type { ChapterType, MangaType } from 'types';
import SinglePageReader from 'components/reader/SinglePageReader';

// NOTE: prepending urlPrefix to all links in this component so I can accomodate
//       Library and Catalogue Readers. This is sort of hacky, but it works for now.

// TODO: If I want an <img alt="...">, I need mangaInfo, which I don't have right now.

// TODO: eventually create a preloading component?
//       similar to this - https://github.com/mcarlucci/react-precache-img
// TODO: research if it's possible to cache too many images? If so, how do you clear old images?
// TODO: FIXME: Browser doesn't seem to be pulling images from cache.
// Not sure if that's a backend header problem, browser problem, or a local development problem
// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???
// TODO: preload pages from the next chapter

// TODO: allow keyboard commands for reading

// TODO: might need to update read status if you press next page while on the last page of a chapter
//       Possible scenario, you skip to the last page via the slider.
//       When you press next to go to the next chapter, your reading status has not been changed.

// https://tylermcginnis.com/react-router-programmatically-navigate/

// https://www.javascriptstuff.com/detect-image-load/

const styles = {
  // Need to set the backgroundImage url as well
  mangaImage: {
    height: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
  },
};

type Props = ReaderContainerProps & {
  classes: Object, // Classes is the injected styles
  history: { push: Function }, // Below are react-router props
};

class Reader extends Component<Props> {
  componentDidMount() {
    this.props.fetchMangaInfo();
    this.props.fetchChapters()
      .then(this.getAdjacentPageCounts);
  }

  componentDidUpdate(prevProps: Props) {
    const { page, chapterId } = this.props;

    const pageChanged = page !== prevProps.page;
    const chapterChanged = chapterId !== prevProps.chapterId;

    // Preload more images when page or chapter changes.
    // Should also fire once on page load.
    if (pageChanged || chapterChanged) {
      this.preloadImages();
    }

    // Always have the adjacent chapters' page counts loaded
    if (chapterChanged) {
      this.getAdjacentPageCounts();
    }
  }

  getAdjacentPageCounts = () => {
    // get current, previous, and next chapter page count
    const {
      chapterId, prevChapterId, nextChapterId, fetchPageCount,
    } = this.props;
    const chapters: Array<number> = compact([chapterId, prevChapterId, nextChapterId]);

    chapters.forEach((thisChapterId) => {
      fetchPageCount(thisChapterId);
    });
  };

  preloadImages = () => {
    // https://www.photo-mark.com/notes/image-preloading/
    // https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    const {
      mangaInfo, chapterId, pageCount, page,
    } = this.props;
    const numPreload = 3; // Currently preloading 3 images ahead

    if (!mangaInfo) return;

    for (let i = 1; i <= numPreload; i += 1) {
      if (page + i < pageCount) {
        // Chrome would only preload if a new image object was used every time
        const image = new Image();
        image.src = Server.image(mangaInfo.id, chapterId, page + i);
      }
    }
  };

  handlePrevPageClick = () => {
    const {
      mangaInfo, chapterId, page, prevChapterId, pageCounts, urlPrefix,
    } = this.props;

    if (!mangaInfo) return;

    if (page > 0) {
      this.props.history.push(urlPrefix + Client.page(mangaInfo.id, chapterId, page - 1));
    } else if (page === 0 && prevChapterId) {
      // If on the first page, go to the previous chapter's last page
      const prevPageCount: ?number = pageCounts[prevChapterId];
      const lastPage = prevPageCount ? prevPageCount - 1 : 0;

      this.props.history.push(urlPrefix + Client.page(mangaInfo.id, prevChapterId, lastPage));
    }
  };

  handleNextPageClick = () => {
    const {
      mangaInfo, chapter, chapterId, pageCount, page, nextChapterId, updateReadingStatus, urlPrefix,
    } = this.props;

    if (!mangaInfo) return;

    if (page < pageCount - 1) {
      updateReadingStatus(chapter, pageCount, page + 1);
      this.props.history.push(urlPrefix + Client.page(mangaInfo.id, chapterId, page + 1));
    } else if (page === pageCount - 1 && nextChapterId) {
      this.props.history.push(urlPrefix + Client.page(mangaInfo.id, nextChapterId, 0));
    }
  };

  prevChapterUrl = () => {
    // Links to the previous chapter's last page read
    const {
      mangaInfo, prevChapterId, chapters, urlPrefix,
    } = this.props;
    return urlPrefix + changeChapterUrl(mangaInfo, prevChapterId, chapters);
  };

  nextChapterUrl = () => {
    // Links to the next chapter's last page read
    const {
      mangaInfo, nextChapterId, chapters, urlPrefix,
    } = this.props;
    return urlPrefix + changeChapterUrl(mangaInfo, nextChapterId, chapters);
  };

  handleJumpToPage = (newPage: number) => {
    const { mangaInfo, chapterId, urlPrefix } = this.props;

    if (!mangaInfo) return;
    this.props.history.push(urlPrefix + Client.page(mangaInfo.id, chapterId, newPage - 1));
  };

  render() {
    const {
      mangaInfo,
      chapters,
      chapter,
      chapterId,
      pageCount,
      page,
      classes,
      prevChapterId,
      nextChapterId,
    } = this.props;

    if (!mangaInfo || !chapters.length || !chapter || !pageCount) {
      return <FullScreenLoading />;
    }

    const imageSource = Server.image(mangaInfo.id, chapterId, page);
    const backgroundImageStyle = {
      backgroundImage: `url(${imageSource})`,
    };

    return (
      <React.Fragment>

        <ReaderOverlay
          title={mangaInfo.title}
          chapterNum={chapter.chapter_number}
          pageCount={pageCount}
          mangaId={mangaInfo.id}
          urlPrefix={this.props.urlPrefix}
        >
          <IconButton component={Link} to={this.prevChapterUrl()} disabled={!prevChapterId}>
            <Icon>skip_previous</Icon>
          </IconButton>

          <PageSlider
            pageCount={pageCount}
            page={page}
            onJumpToPage={this.handleJumpToPage}
          />

          <IconButton component={Link} to={this.nextChapterUrl()} disabled={!nextChapterId}>
            <Icon>skip_next</Icon>
          </IconButton>
        </ReaderOverlay>

        <SinglePageReader
          imageSource={imageSource}
          onNextPageClick={this.handleNextPageClick}
          onPrevPageClick={this.handlePrevPageClick}
        />

      </React.Fragment>
    );
  }
}

// Helper methods
function changeChapterUrl(
  mangaInfo: ?MangaType,
  newChapterId: ?number,
  chapters: Array<ChapterType>,
): string {
  if (!mangaInfo || !newChapterId) {
    // react-router Link does not take null, so use this to create a no-op link
    // This link should not actually be clickable in the first place
    return 'javascript:void(0);'; // eslint-disable-line no-script-url
  }

  const newChapter: ?ChapterType = findChapter(chapters, newChapterId);
  let goToPage = newChapter ? newChapter.last_page_read : 0;

  if (newChapter && newChapter.read) {
    goToPage = 0;
  }

  return Client.page(mangaInfo.id, newChapterId, goToPage);
}

function findChapter(chapters: Array<ChapterType>, chapterId: number): ?ChapterType {
  if (!chapters || chapters.length === 0) return null;

  return chapters.find(chapter => chapter.id === chapterId);
}

export default withStyles(styles)(Reader);
