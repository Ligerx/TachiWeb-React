// @flow
import React, { Component } from 'react';
import { Server, Client } from 'api';
import FullScreenLoading from 'components/loading/FullScreenLoading';
import compact from 'lodash/compact';
import type { ReaderContainerProps } from 'containers/ReaderContainer';
import type { ChapterType, MangaType } from 'types';
import SinglePageReader from 'components/reader/SinglePageReader';
import WebtoonReader from 'components/reader/WebtoonReader';
import ReadingStatusUpdaterContainer from 'containers/ReadingStatusUpdaterContainer';
import ImagePreloaderContainer from 'containers/ImagePreloaderContainer';
import { Helmet } from 'react-helmet';
import { chapterNumPrettyPrint } from 'components/utils';
import { UrlPrefixConsumer } from 'components/UrlPrefixContext';

// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???

// https://www.javascriptstuff.com/detect-image-load/
// https://tylermcginnis.com/react-router-programmatically-navigate/

type Props = ReaderContainerProps & {
  classes: Object, // Classes is the injected styles
  history: { push: Function }, // react-router props
  urlPrefix: string, // UrlPrefixConsumer prop
};

class Reader extends Component<Props> {
  componentDidMount() {
    this.props.fetchMangaInfo();
    this.props.fetchChapters()
      .then(this.getAdjacentPageCounts);
  }

  componentDidUpdate(prevProps: Props) {
    const { chapterId } = this.props;
    const chapterChanged = chapterId !== prevProps.chapterId;

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

  prevPageUrl = (): ?string => {
    const {
      mangaInfo, chapterId, page, prevChapterId, pageCounts, urlPrefix,
    } = this.props;

    if (!mangaInfo) return null;

    if (page > 0) {
      return Client.page(urlPrefix, mangaInfo.id, chapterId, page - 1);
    } else if (page === 0 && prevChapterId) {
      // If on the first page, link to the previous chapter's last page (if info available)
      const prevPageCount: ?number = pageCounts[prevChapterId];
      const lastPage = prevPageCount ? prevPageCount - 1 : 0;

      return Client.page(urlPrefix, mangaInfo.id, prevChapterId, lastPage);
    }
    return null;
  };

  nextPageUrl = (): ?string => {
    const {
      mangaInfo, chapterId, pageCount, page, nextChapterId, urlPrefix,
    } = this.props;

    if (!mangaInfo) return null;

    if (page < pageCount - 1) {
      return Client.page(urlPrefix, mangaInfo.id, chapterId, page + 1);
    } else if (page === pageCount - 1 && nextChapterId) {
      return Client.page(urlPrefix, mangaInfo.id, nextChapterId, 0);
    }
    return null;
  };

  prevChapterUrl = (): ?string => {
    // Links to the previous chapter's last page read
    const {
      mangaInfo, prevChapterId, chapters, urlPrefix,
    } = this.props;

    const prevUrl = changeChapterUrl(urlPrefix, mangaInfo, prevChapterId, chapters);

    if (!prevUrl) return null;
    return prevUrl;
  };

  nextChapterUrl = (): ?string => {
    // Links to the next chapter's last page read
    const {
      mangaInfo, nextChapterId, chapters, urlPrefix,
    } = this.props;

    const nextUrl = changeChapterUrl(urlPrefix, mangaInfo, nextChapterId, chapters);

    if (!nextUrl) return null;
    return nextUrl;
  };

  render() {
    const {
      urlPrefix,
      mangaInfo,
      chapters,
      chapter,
      chapterId,
      pageCount,
      page,
    } = this.props;

    if (!mangaInfo || !chapters.length || !chapter || !pageCount) {
      return <FullScreenLoading />;
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>
            {`${mangaInfo.title} - Ch. ${chapterNumPrettyPrint(chapter.chapter_number)}, Pg. ${page + 1}`}
            - TachiWeb
          </title>
        </Helmet>

        {/*
        <SinglePageReader
          title={mangaInfo.title}
          chapterNum={chapter.chapter_number}
          pageCount={pageCount}
          page={page}
          backUrl={Client.manga(urlPrefix, mangaInfo.id)}
          prevChapterUrl={this.prevChapterUrl()}
          nextChapterUrl={this.nextChapterUrl()}
          urlPrefix={urlPrefix}
          mangaId={mangaInfo.id}
          chapterId={chapterId}
          imageSource={Server.image(mangaInfo.id, chapterId, page)}
          alt={`${chapter.name} - Page ${page + 1}`}
          nextPageUrl={this.nextPageUrl()}
          prevPageUrl={this.prevPageUrl()}
        />
        */}

        <WebtoonReader
          title={mangaInfo.title}
          chapterNum={chapter.chapter_number}
          page={page}
          backUrl={Client.manga(urlPrefix, mangaInfo.id)}
          mangaId={mangaInfo.id}
          pageCount={pageCount}
          chapter={chapter}
          nextChapterUrl={this.nextChapterUrl()}
          prevChapterUrl={this.prevChapterUrl()}
        />

        <ReadingStatusUpdaterContainer />
        <ImagePreloaderContainer />

      </React.Fragment>
    );
  }
}

// Helper methods
function changeChapterUrl(
  urlPrefix: string,
  mangaInfo: ?MangaType,
  newChapterId: ?number,
  chapters: Array<ChapterType>,
): ?string {
  if (!mangaInfo || !newChapterId) return null;

  const newChapter: ?ChapterType = findChapter(chapters, newChapterId);
  let goToPage = newChapter ? newChapter.last_page_read : 0;

  if (newChapter && newChapter.read) {
    goToPage = 0;
  }

  return Client.page(urlPrefix, mangaInfo.id, newChapterId, goToPage);
}

function findChapter(chapters: Array<ChapterType>, chapterId: number): ?ChapterType {
  if (!chapters || chapters.length === 0) return null;

  return chapters.find(chapter => chapter.id === chapterId);
}

export default (props: Object) => (
  <UrlPrefixConsumer>
    {urlPrefix => <Reader {...props} urlPrefix={urlPrefix} />}
  </UrlPrefixConsumer>
);
