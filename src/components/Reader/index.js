// @flow
import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Server, Client } from "api";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import compact from "lodash/compact";
import type { Manga } from "@tachiweb/api-client";
import type { ChapterType } from "types";
import SinglePageReader from "components/Reader/SinglePageReader";
import SinglePageReader2 from "components/Reader/SinglePageReader2";
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
  const chapters = useSelector(state => selectChaptersForManga(state, mangaId));
  const chapter = useSelector(state =>
    selectChapter(state, mangaId, chapterId)
  );
  const pageCounts = useSelector(selectPageCounts);

  const pageCount = useSelector(state => selectPageCount(state, chapterId));
  const prevChapter = useSelector(state =>
    selectPrevChapter(state, mangaId, chapterId)
  );
  const nextChapter = useSelector(state =>
    selectNextChapter(state, mangaId, chapterId)
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
        <SinglePageReader2
          mangaInfo={mangaInfo}
          chapter={chapter}
          pageCount={pageCount}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
        />
      )}
    </>
  );
};

export default Reader;
