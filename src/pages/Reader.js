// @flow
import React, { Component } from 'react';
import { Server, Client } from 'api';
import ReaderOverlay from 'components/ReaderOverlay';
import ReaderNavButtons from 'components/ReaderNavButtons';
import { MangaType, ChapterType } from 'types';
import { withStyles } from '@material-ui/core/styles';
import PageSlider from 'components/PageSlider';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';
import FullScreenLoading from 'components/loading/FullScreenLoading';
import compact from 'lodash/compact';

// TODO: If I want an <img alt="...">, I need mangaInfo, which I don't have right now.

// TODO: eventually create a preloading component?
//       similar to this - https://github.com/mcarlucci/react-precache-img
// TODO: research if it's possible to cache too many images? If so, how do you clear old images?
// TODO: FIXME: Browser doesn't seem to be pulling images from cache.
// Not sure if that's a backend header problem, browser problem, or a local development problem
// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???
// TODO: preload pages from the next chapter

// TODO: allow keyboard commands for reading

// TODO: just realized that when you finish chapters (or mark as unread),
//       I need to keep the chapters data up to date or the Library's unread chapters will be stale

// FIXME: For some reason, loading a Reader page send out a bazillion requests. Refer to
//        the redux actions. It's not breaking anything, but I want to fix this.

// TODO: remove any instance of parseInt used to convert page from string -> int
//       the container is already doing that conversation when passing props

// NOTE: only updating read status when the user presses the next page button
//       not sure if it's necessary to do it in more cases than this
//       e.g. jumping pages using the slider, jumping chapters, going backwards in pages

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

type Props = {
  mangaInfo?: MangaType,
  chapters?: Array<ChapterType>,
  chapter?: ChapterType,
  chapterId: number,
  pageCounts: Object, // TODO: type???
  pageCount?: number,
  page: number,
  prevChapterId?: number,
  nextChapterId?: number,
  // Redux actions
  fetchMangaInfo: Function,
  fetchChapters: Function,
  fetchPageCount: Function,
  updateReadingStatus: Function,
  // Classes is the injected styles
  classes: Object,
  // Below are react-router props
  history: { push: Function },
};

class Reader extends Component<Props> {
  static defaultProps = {
    mangaInfo: null,
    chapters: [],
    chapter: null,
    pageCount: 0,
    prevChapterId: null,
    nextChapterId: null,
  }

  componentDidMount() {
    this.props.fetchMangaInfo();
    this.props.fetchChapters();
    this.props.fetchPageCount(this.props.chapterId);
  }

  componentDidUpdate(prevProps) {
    const {
      page, chapterId, prevChapterId, nextChapterId,
    } = this.props;

    const pageChanged = page !== prevProps.page;
    const chapterChanged = chapterId !== prevProps.chapterId;
    const prevChapterChanged = prevChapterId !== prevProps.prevChapterId;
    const nextChapterChanged = nextChapterId !== prevProps.nextChapterId;

    // Preload more images when page or chapter changes.
    // Should also fire once on page load.
    if (pageChanged || chapterChanged) {
      this.preloadImages();
    }

    // Always have the adjacent chapters' page counts loaded
    // Also should fire once on page load.
    if (chapterChanged || prevChapterChanged || nextChapterChanged) {
      this.getAdjacentPageCounts();
    }
  }

  getAdjacentPageCounts = () => {
    // get current, previous, and next chapter page count
    const {
      chapterId, prevChapterId, nextChapterId, fetchPageCount,
    } = this.props;
    const chapters = compact([chapterId, prevChapterId, nextChapterId]);

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
    const pageInt = parseInt(page, 10); // params are always strings, string -> int
    const numPreload = 3; // Currently preloading 3 images ahead

    for (let i = 1; i <= numPreload; i += 1) {
      if (parseInt(pageInt, 10) + i < pageCount) {
        // Chrome would only preload if a new image object was used every time
        const image = new Image();
        image.src = Server.image(mangaInfo.id, chapterId, pageInt + i);
      }
    }
  };

  handlePrevPageClick = () => {
    const {
      mangaInfo, chapterId, page, prevChapterId, pageCounts,
    } = this.props;
    const pageInt = parseInt(page, 10);

    if (pageInt > 0) {
      this.props.history.push(Client.page(mangaInfo.id, chapterId, pageInt - 1));
    } else if (pageInt === 0 && prevChapterId) {
      // If on the first page, go to the previous chapter's last page
      const prevPageCount = pageCounts[prevChapterId];
      const lastPage = prevPageCount ? prevPageCount - 1 : 0;

      this.props.history.push(Client.page(mangaInfo.id, prevChapterId, lastPage));
    }
  };

  handleNextPageClick = () => {
    const {
      mangaInfo, chapter, chapterId, pageCount, page, nextChapterId, updateReadingStatus,
    } = this.props;
    const pageInt = parseInt(page, 10);

    if (pageInt < pageCount - 1) {
      updateReadingStatus(chapter, pageCount, page + 1);
      this.props.history.push(Client.page(mangaInfo.id, chapterId, pageInt + 1));
    } else if (pageInt === pageCount - 1 && nextChapterId) {
      this.props.history.push(Client.page(mangaInfo.id, nextChapterId, 0));
    }
  };

  prevChapterUrl = () => {
    // Links to the previous chapter's last page read
    const { mangaInfo, prevChapterId, chapters } = this.props;
    return changeChapterUrl(mangaInfo.id, prevChapterId, chapters);
  };

  nextChapterUrl = () => {
    // Links to the next chapter's last page read
    const { mangaInfo, nextChapterId, chapters } = this.props;
    return changeChapterUrl(mangaInfo.id, nextChapterId, chapters);
  };

  handleJumpToPage = (newPage) => {
    const { mangaInfo, chapterId } = this.props;
    this.props.history.push(Client.page(mangaInfo.id, chapterId, newPage - 1));
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

    const backgroundImageStyle = {
      backgroundImage: `url(${Server.image(mangaInfo.id, chapterId, page)})`,
    };

    return (
      <React.Fragment>

        <ReaderOverlay
          title={mangaInfo.title}
          chapterNum={chapter.chapter_number}
          pageCount={pageCount}
          mangaId={mangaInfo.id}
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

// Helper methods
function changeChapterUrl(mangaId, newChapterId, chapters) {
  const newChapter = findChapter(chapters, newChapterId);
  let goToPage = newChapter ? newChapter.last_page_read : 0;

  if (newChapter && newChapter.read) {
    goToPage = 0;
  }

  return Client.page(mangaId, newChapterId, goToPage);
}

function findChapter(chapters, chapterId) {
  if (!chapters || chapters.length === 0) return null;

  return chapters.find(chapter => chapter.id === parseInt(chapterId, 10));
}

export default withStyles(styles)(Reader);
