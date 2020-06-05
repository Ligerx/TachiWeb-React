// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { MangaViewer } from "@tachiweb/api-client";
import type { SettingViewerType, ChapterType } from "types";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import compact from "lodash/compact";
import SinglePageReader from "components/Reader/SinglePageReader";
import WebtoonReader from "components/Reader/WebtoonReader";
import { fetchChapters } from "redux-ducks/chapters/actionCreators";
import { fetchPageCount } from "redux-ducks/pageCounts/actionCreators";
import { selectDefaultViewer } from "redux-ducks/settings";
import { fetchMangaInfo } from "redux-ducks/mangaInfos/actionCreators";
import { useMangaInfo, useChapters, usePageCount } from "apiHooks";

// TODO: FIXME: If I switch pages really fast, the browser forcefully redownload images???

type RouterProps = { match: { params: Object } };

const Reader = ({ match: { params } }: RouterProps) => {
  const mangaId = parseInt(params.mangaId, 10);
  const chapterId = parseInt(params.chapterId, 10);

  const dispatch = useDispatch();

  const defaultViewer = useSelector(selectDefaultViewer);

  const { data: mangaInfo } = useMangaInfo(mangaId);
  const { data: chapters = [] } = useChapters(mangaId); // defaulting to empty array to simplify null checking

  // TODO since apiHooks can return undefined as they fetch, need to do some null checking or return early
  const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
  const chapter: ?ChapterType = chapters[chapterIndex];
  const prevChapter: ?ChapterType = chapters[chapterIndex - 1];
  const nextChapter: ?ChapterType = chapters[chapterIndex + 1];

  const { data: pageCount } = usePageCount(mangaId, chapter?.id);
  const { data: prevChapterPageCount } = usePageCount(mangaId, prevChapter?.id);
  usePageCount(mangaId, nextChapter?.id); // fetch next chapter early, but don't need any of it's data right now

  // TODO remove this
  useEffect(() => {
    dispatch(fetchMangaInfo(mangaId)); // remove
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
  }, [mangaId, chapterId, prevChapter, nextChapter, dispatch]);

  if (mangaInfo == null || chapter == null || pageCount == null) {
    return <FullScreenLoading />;
  }
  // //

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
  return <div>Error: No reader type specified...</div>;
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
