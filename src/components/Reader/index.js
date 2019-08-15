// @flow
import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Server, Client } from "api";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import compact from "lodash/compact";
import type { Manga } from "@tachiweb/api-client";
import type { ChapterType } from "types";
import SinglePageReader from "components/Reader/SinglePageReader";
import WebtoonReader from "components/Reader/WebtoonReader";
import { Helmet } from "react-helmet";
import { chapterNumPrettyPrint } from "components/utils";
import UrlPrefixContext from "components/UrlPrefixContext";
import {
  selectChaptersForManga,
  selectChapter,
  selectNextChapter,
  selectPrevChapter
} from "redux-ducks/chapters";
import { fetchChapters } from "redux-ducks/chapters/actionCreators";
import { selectPageCounts, selectPageCount } from "redux-ducks/pageCounts";
import { fetchPageCount } from "redux-ducks/pageCounts/actionCreators";
import { selectDefaultViewer } from "redux-ducks/settings";
import { selectMangaInfo } from "redux-ducks/mangaInfos";
import { fetchMangaInfo } from "redux-ducks/mangaInfos/actionCreators";

// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???

type Props = { match: { params: Object } };

const Reader = ({ match: { params } }: Props) => {
  const mangaId = parseInt(params.mangaId, 10);
  const chapterId = parseInt(params.chapterId, 10);

  const defaultViewer = useSelector(selectDefaultViewer);
  const mangaInfo = useSelector(state => selectMangaInfo(state, mangaId));
  const chapter = useSelector(state =>
    selectChapter(state, mangaId, chapterId)
  );
  const prevChapter = useSelector(state =>
    selectPrevChapter(state, mangaId, chapterId)
  );
  const nextChapter = useSelector(state =>
    selectNextChapter(state, mangaId, chapterId)
  );

  const pageCount = useSelector(state => selectPageCount(state, chapterId));
  const prevChapterPageCount = useSelector(state => {
    // This should be fine since null === null so it's a pure function still,
    // plus the extra logic shouldn't be very expensive
    if (prevChapter == null) return null;
    return selectPageCount(state, prevChapter.id);
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMangaInfo(mangaId));
    dispatch(fetchChapters(mangaId));
  }, [dispatch, mangaId]);

  useEffect(() => {
    // Get adjacent chapter page counts
    const chapterIds: Array<number> = compact([
      chapterId,
      prevChapter ? prevChapter.id : null,
      nextChapter ? nextChapter.id : null
    ]);

    chapterIds.forEach(thisChapterId => {
      dispatch(fetchPageCount(mangaId, thisChapterId));
    });
  }, [dispatch, mangaId, chapterId, prevChapter, nextChapter]);

  if (mangaInfo == null || chapter == null || pageCount == null) {
    return <FullScreenLoading />;
  }

  return (
    <>
      {/* <Helmet
        title={`${mangaInfo.title} - Ch. ${chapterNumPrettyPrint(
          chapter.chapter_number
        )}, Pg. ${page + 1} TachiWeb`}
      /> */}

      {defaultViewer === "webtoon" ? (
        <div />
      ) : (
        // <WebtoonReader
        //   title={mangaInfo.title}
        //   chapterNum={chapter.chapter_number}
        //   page={page}
        //   backUrl={Client.manga(urlPrefix, mangaInfo.id)}
        //   urlPrefix={urlPrefix}
        //   mangaId={mangaInfo.id}
        //   pageCount={pageCount}
        //   chapter={chapter}
        //   nextChapterUrl={nextChapterUrl()}
        //   prevChapterUrl={prevChapterUrl()}
        // />
        <SinglePageReader
          mangaInfo={mangaInfo}
          chapter={chapter}
          pageCount={pageCount}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
          prevChapterPageCount={prevChapterPageCount}
        />
      )}
    </>
  );
};

export default Reader;
