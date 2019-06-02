// @flow
import * as React from "react";
import type { MangaType } from "types";
import { Helmet } from "react-helmet";
import MangaInfoHeader from "components/mangaInfo/MangaInfoHeader";
import MangaInfoDetails from "components/mangaInfo/MangaInfoDetails";
import FullScreenLoading from "components/loading/FullScreenLoading";
import MangaInfoChapters from "components/mangaInfo/MangaInfoChapters";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIsMangaInfosLoading,
  selectMangaInfo,
  fetchMangaInfo,
  updateMangaInfo,
  setFlag
} from "redux-ducks/mangaInfos";
import {
  selectIsChaptersLoading,
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

  const [tabValue, setTabValue] = React.useState(defaultTab);

  const mangaInfo = useSelector(state => selectMangaInfo(state, mangaId));
  const chapters = useSelector(state => selectChaptersForManga(state, mangaId));
  const isMangaInfosLoading = useSelector(selectIsMangaInfosLoading);
  const isChaptersLoading = useSelector(selectIsChaptersLoading);

  const dispatch = useDispatch();
  const handleSetFlag = (flag, state) =>
    dispatch(setFlag(mangaId, flag, state));
  const handleToggleRead = (chapterId, read) =>
    dispatch(toggleRead(mangaId, chapterId, read));

  React.useEffect(() => {
    dispatch(fetchChapters(mangaId))
      .then(() => {
        // Fetch chapters cached on the server
        // If there are none, tell the server to scrape chapters from the site
        if (!chapters.length) {
          return dispatch(updateChapters(mangaId)); // return promise so next .then()'s wait
        }
        return null;
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

  const tabContent = (): React.Node => {
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
