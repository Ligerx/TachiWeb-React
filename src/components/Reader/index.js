// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { MangaViewer } from "@tachiweb/api-client";
import type { SettingViewerType } from "types";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import compact from "lodash/compact";
import SinglePageReader from "components/Reader/SinglePageReader";
import WebtoonReader from "components/Reader/WebtoonReader";
import {
  selectChapter,
  selectNextChapter,
  selectPrevChapter
} from "redux-ducks/chapters";
import { fetchChapters } from "redux-ducks/chapters/actionCreators";
import { selectPageCount } from "redux-ducks/pageCounts";
import { fetchPageCount } from "redux-ducks/pageCounts/actionCreators";
import { selectDefaultViewer } from "redux-ducks/settings";
import { selectMangaInfo } from "redux-ducks/mangaInfos";
import { fetchMangaInfo } from "redux-ducks/mangaInfos/actionCreators";

// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???

type RouterProps = { match: { params: Object } };

const Reader = ({ match: { params } }: RouterProps) => {
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

  const viewer = getViewer(mangaInfo.viewer, defaultViewer);

  if (viewer === "WEBTOON") {
    return (
      <WebtoonReader
        mangaInfo={mangaInfo}
        chapter={chapter}
        pageCount={pageCount}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
    );
  }
  // [Sept 28, 2019] SinglePageReader doesn't differentiate between L->R or R->L
  if (viewer === "LEFT_TO_RIGHT" || viewer === "RIGHT_TO_LEFT") {
    return (
      <SinglePageReader
        mangaInfo={mangaInfo}
        chapter={chapter}
        pageCount={pageCount}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        prevChapterPageCount={prevChapterPageCount}
      />
    );
  }

  console.error("No reader type specified???");
};

function getViewer(mangaViewer: MangaViewer, settingViewer: SettingViewerType) {
  if (mangaViewer === "DEFAULT") {
    if (settingViewer == null) {
      // default value in case both manga and setting viewers are not set
      return "LEFT_TO_RIGHT";
    }
    // [Sept 28, 2019] mismatch between uppercase manga viewer (eg. "WEBTOON") and
    // lowercase setting viewer (eg. "webtoon"). Using uppercase right now.
    return settingViewer.toUpperCase();
  }

  return mangaViewer;
}

export default Reader;
