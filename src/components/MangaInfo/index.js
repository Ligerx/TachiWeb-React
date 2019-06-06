// @flow
import React, { useEffect, useState, type Node } from "react";
import type { MangaType } from "types";
import { Helmet } from "react-helmet";
import MangaInfoHeader from "components/MangaInfo/MangaInfoHeader";
import MangaInfoDetails from "components/MangaInfo/MangaInfoDetails";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import MangaInfoChapters from "components/MangaInfo/MangaInfoChapters";
import { useSelector, useDispatch, useStore } from "react-redux";
import {
  selectIsMangaInfosLoading,
  selectMangaInfo,
  fetchMangaInfo,
  updateMangaInfo,
  setFlag
} from "redux-ducks/mangaInfos";
import {
  selectIsChaptersLoading,
  selectFilteredSortedChapters,
  selectChaptersForManga,
  fetchChapters,
  updateChapters,
  toggleRead
} from "redux-ducks/chapters";

type Props = {
  backUrl: string,
  defaultTab: number,

  // react router props
  match: { params: Object }
};

const MangaInfo = ({ backUrl, defaultTab, match: { params } }: Props) => {
  const mangaId = parseInt(params.mangaId, 10);

  const [tabValue, setTabValue] = useState(defaultTab);

  const mangaInfo = useSelector(state => selectMangaInfo(state, mangaId));
  const chapters = useSelector(state =>
    selectFilteredSortedChapters(state, mangaId)
  );
  const isMangaInfosLoading = useSelector(selectIsMangaInfosLoading);
  const isChaptersLoading = useSelector(selectIsChaptersLoading);

  const dispatch = useDispatch();
  const handleSetFlag = (flag, state) =>
    dispatch(setFlag(mangaId, flag, state));
  const handleToggleRead = (chapterId, read) =>
    dispatch(toggleRead(mangaId, chapterId, read));

  const store = useStore();

  useEffect(() => {
    dispatch(fetchChapters(mangaId))
      .then(() => {
        // The first time a manga is loaded by the server, it will not have any chapters scraped.
        // So check if we found any chapters. If not, try scraping the site once.

        // Check for chapters directly in the store instead of relying on useSelector().
        // This is because the useSelector() value doesn't update until the next render
        // which occurs AFTER this useEffect() promise runs.
        const chaptersInStore = selectChaptersForManga(
          store.getState(),
          mangaId
        );

        if (!chaptersInStore.length) {
          // return promise so next .then()'s wait until the data has finished fetching
          return dispatch(updateChapters(mangaId));
        }
      })
      .then(() => dispatch(fetchMangaInfo(mangaId)))
      .then(() => {
        // If we think the server hasn't had enough time to scrape the source website
        // for this mangaInfo, wait a little while and try fetching again.
        //
        // NOTE: This only updates the manga being viewed. Many of your other search results are
        //       likely missing information as well. Viewing them will then fetch the data.
        //
        // TODO: might try to do one additional fetch at a slightly later time. e.g. 1000 ms
        if (mangaInfo && possiblyMissingInfo(mangaInfo)) {
          setTimeout(() => dispatch(updateMangaInfo(mangaId)), 300);
        }
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeTab = (event: SyntheticEvent<>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefreshClick = () => {
    // Running updateChapters also updates mangaInfo.chapters and mangaInfo.unread
    // So run updateMangaInfo after chapters
    dispatch(updateChapters(mangaId)).then(() =>
      dispatch(updateMangaInfo(mangaId))
    );
  };

  const tabContent = (): Node => {
    const numChapters: number = chapters ? chapters.length : 0;

    if (mangaInfo && tabValue === 0) {
      return (
        <MangaInfoDetails mangaInfo={mangaInfo} numChapters={numChapters} />
      );
    }
    if (mangaInfo && tabValue === 1) {
      return (
        <MangaInfoChapters
          chapters={chapters}
          mangaInfo={mangaInfo}
          toggleRead={handleToggleRead}
        />
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <Helmet
        title={`${mangaInfo ? mangaInfo.title : "Loading..."} - TachiWeb`}
      />

      <MangaInfoHeader
        mangaInfo={mangaInfo}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        onBackClick={backUrl}
        onRefreshClick={handleRefreshClick}
        setFlag={handleSetFlag}
      />
      {tabContent()}

      {(isMangaInfosLoading || isChaptersLoading) && <FullScreenLoading />}
    </React.Fragment>
  );
};

// Helper methods
function possiblyMissingInfo(manga: MangaType): boolean {
  // mangaFields is an array of some values that mangaInfo should probably have
  // Count the number of these fields that are missing
  const mangaFields = ["author", "description", "genres", "categories"];

  const numMissing = mangaFields.reduce((counter, field) => {
    const value = manga[field];

    if (!value || (Array.isArray(value) && !value.length)) {
      return counter + 1;
    }
    return counter;
  }, 0);

  // setting the arbitrary amount of missing info at 3 to be considered missing info
  return numMissing >= 3;
}

export default MangaInfo;
