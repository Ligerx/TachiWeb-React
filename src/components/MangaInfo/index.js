// @flow
import React, { useEffect, useState, type Node } from "react";
import type { MangaType } from "types";
import { Helmet } from "react-helmet";
import MangaInfoHeader from "components/MangaInfo/MangaInfoHeader";
import MangaInfoDetails from "components/MangaInfo/MangaInfoDetails";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import ContinueReadingButton from "components/MangaInfo/ContinueReadingButton";
import MangaInfoChapterList from "components/MangaInfo/MangaInfoChapterList";
import CenterHorizontally from "components/CenterHorizontally";
import { useSelector, useDispatch, useStore } from "react-redux";
import {
  selectIsMangaInfosLoading,
  selectMangaInfo
} from "redux-ducks/mangaInfos";
import {
  fetchMangaInfo,
  updateMangaInfo
} from "redux-ducks/mangaInfos/actionCreators";
import {
  selectIsChaptersLoading,
  selectFilteredSortedChapters,
  selectChaptersForManga,
  fetchChapters,
  updateChapters
} from "redux-ducks/chapters";
import { makeStyles } from "@material-ui/styles";

type Props = {
  backUrl: string,
  defaultTab: number,

  // react router props
  match: { params: Object }
};

const useStyles = makeStyles({
  // use flexbox to allow virtualized chapter list fill the remaining
  // viewport height with flex-grow: 1
  parent: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }
});

const MangaInfo = ({ backUrl, defaultTab, match: { params } }: Props) => {
  const classes = useStyles();

  const mangaId = parseInt(params.mangaId, 10);

  const [tabValue, setTabValue] = useState(defaultTab);

  const mangaInfo = useSelector(state => selectMangaInfo(state, mangaId));
  const chapters = useSelector(state =>
    selectFilteredSortedChapters(state, mangaId)
  );
  const isMangaInfosLoading = useSelector(selectIsMangaInfosLoading);
  const isChaptersLoading = useSelector(selectIsChaptersLoading);

  const dispatch = useDispatch();

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

  const tabContent = (): Node => {
    const numChapters: number = chapters ? chapters.length : 0;

    if (mangaInfo && tabValue === 0) {
      return (
        <MangaInfoDetails mangaInfo={mangaInfo} numChapters={numChapters} />
      );
    }
    if (mangaInfo && tabValue === 1) {
      return (
        <>
          <CenterHorizontally>
            <ContinueReadingButton mangaId={mangaInfo.id} />
          </CenterHorizontally>

          <MangaInfoChapterList chapters={chapters} mangaInfo={mangaInfo} />
        </>
      );
    }
    return null;
  };

  if (!mangaInfo) return <FullScreenLoading />;

  return (
    <div className={classes.parent}>
      <Helmet title={`${mangaInfo.title} - TachiWeb`} />

      <MangaInfoHeader
        mangaInfo={mangaInfo}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        onBackClick={backUrl}
      />

      {tabContent()}

      {(isMangaInfosLoading || isChaptersLoading) && <FullScreenLoading />}
    </div>
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
