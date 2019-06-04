// @flow
import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Server, Client } from "api";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import compact from "lodash/compact";
import type { ChapterType, MangaType } from "types";
import SinglePageReader from "components/Reader/SinglePageReader";
import WebtoonReader from "components/Reader/WebtoonReader";
import ReadingStatusUpdater from "components/Reader/ReadingStatusUpdater";
import ImagePreloader from "components/Reader/ImagePreloader";
import { Helmet } from "react-helmet";
import { chapterNumPrettyPrint } from "components/utils";
import UrlPrefixContext from "components/UrlPrefixContext";
import {
  selectChaptersForManga,
  selectChapter,
  selectNextChapterId,
  selectPrevChapterId,
  fetchChapters
} from "redux-ducks/chapters";
import {
  selectPageCounts,
  selectPageCount,
  fetchPageCount
} from "redux-ducks/pageCounts";
import { selectDefaultViewer } from "redux-ducks/settings";
import { selectMangaInfo, fetchMangaInfo } from "redux-ducks/mangaInfos";

// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???

type Props = { match: { params: Object } };

const Reader = ({ match: { params } }: Props) => {
  const mangaId = parseInt(params.mangaId, 10);
  const chapterId = parseInt(params.chapterId, 10);
  const page = parseInt(params.page, 10);

  const urlPrefix = useContext(UrlPrefixContext);

  const defaultViewer = useSelector(selectDefaultViewer);
  const mangaInfo = useSelector(state => selectMangaInfo(state, mangaId));
  const chapters = useSelector(state => selectChaptersForManga(state, mangaId));
  const chapter = useSelector(state =>
    selectChapter(state, mangaId, chapterId)
  );
  const pageCounts = useSelector(selectPageCounts);
  // FIXME: inefficient redux design?
  const pageCount =
    useSelector(state => selectPageCount(state, chapterId)) || 0;
  const prevChapterId = useSelector(state =>
    selectPrevChapterId(state, mangaId, chapterId)
  );
  const nextChapterId = useSelector(state =>
    selectNextChapterId(state, mangaId, chapterId)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMangaInfo(mangaId));
    dispatch(fetchChapters(mangaId));
  }, [dispatch, mangaId]);

  useEffect(() => {
    // Get adjacent chapter page counts
    const chapterIds: Array<number> = compact([
      chapterId,
      prevChapterId,
      nextChapterId
    ]);

    chapterIds.forEach(thisChapterId => {
      dispatch(fetchPageCount(mangaId, thisChapterId));
    });
  }, [dispatch, mangaId, chapterId, nextChapterId, prevChapterId]);

  const prevPageUrl = (): ?string => {
    if (!mangaInfo) return null;

    if (page > 0) {
      return Client.page(urlPrefix, mangaInfo.id, chapterId, page - 1);
    }
    if (page === 0 && prevChapterId) {
      // If on the first page, link to the previous chapter's last page (if info available)
      const prevPageCount: ?number = pageCounts[prevChapterId];
      const lastPage = prevPageCount ? prevPageCount - 1 : 0;

      return Client.page(urlPrefix, mangaInfo.id, prevChapterId, lastPage);
    }
    return null;
  };

  const nextPageUrl = (): ?string => {
    if (!mangaInfo) return null;

    if (page < pageCount - 1) {
      return Client.page(urlPrefix, mangaInfo.id, chapterId, page + 1);
    }
    if (page === pageCount - 1 && nextChapterId) {
      return Client.page(urlPrefix, mangaInfo.id, nextChapterId, 0);
    }
    return null;
  };

  const prevChapterUrl = (): ?string => {
    // Links to the previous chapter's last page read
    const prevUrl = changeChapterUrl(
      urlPrefix,
      mangaInfo,
      prevChapterId,
      chapters
    );

    if (!prevUrl) return null;
    return prevUrl;
  };

  const nextChapterUrl = (): ?string => {
    // Links to the next chapter's last page read
    const nextUrl = changeChapterUrl(
      urlPrefix,
      mangaInfo,
      nextChapterId,
      chapters
    );

    if (!nextUrl) return null;
    return nextUrl;
  };

  if (!mangaInfo || !chapters.length || !chapter || !pageCount) {
    return <FullScreenLoading />;
  }

  return (
    <React.Fragment>
      <Helmet
        title={`${mangaInfo.title} - Ch. ${chapterNumPrettyPrint(
          chapter.chapter_number
        )}, Pg. ${page + 1} TachiWeb`}
      />

      {defaultViewer === "webtoon" ? (
        <WebtoonReader
          title={mangaInfo.title}
          chapterNum={chapter.chapter_number}
          page={page}
          backUrl={Client.manga(urlPrefix, mangaInfo.id)}
          urlPrefix={urlPrefix}
          mangaId={mangaInfo.id}
          pageCount={pageCount}
          chapter={chapter}
          nextChapterUrl={nextChapterUrl()}
          prevChapterUrl={prevChapterUrl()}
        />
      ) : (
        <SinglePageReader
          title={mangaInfo.title}
          chapterNum={chapter.chapter_number}
          pageCount={pageCount}
          page={page}
          backUrl={Client.manga(urlPrefix, mangaInfo.id)}
          prevChapterUrl={prevChapterUrl()}
          nextChapterUrl={nextChapterUrl()}
          urlPrefix={urlPrefix}
          mangaId={mangaInfo.id}
          chapterId={chapterId}
          imageSource={Server.image(mangaInfo.id, chapterId, page)}
          alt={`${chapter.name} - Page ${page + 1}`}
          nextPageUrl={nextPageUrl()}
          prevPageUrl={prevPageUrl()}
        />
      )}

      <ReadingStatusUpdater />
      <ImagePreloader />
    </React.Fragment>
  );
};

// Helper methods
function changeChapterUrl(
  urlPrefix: string,
  mangaInfo: ?MangaType,
  newChapterId: ?number,
  chapters: Array<ChapterType>
): ?string {
  if (!mangaInfo || !newChapterId) return null;

  const newChapter: ?ChapterType = findChapter(chapters, newChapterId);
  let goToPage = newChapter ? newChapter.last_page_read : 0;

  if (newChapter && newChapter.read) {
    goToPage = 0;
  }

  return Client.page(urlPrefix, mangaInfo.id, newChapterId, goToPage);
}

function findChapter(
  chapters: Array<ChapterType>,
  chapterId: number
): ?ChapterType {
  if (!chapters || chapters.length === 0) return null;

  return chapters.find(chapter => chapter.id === chapterId);
}

export default Reader;
