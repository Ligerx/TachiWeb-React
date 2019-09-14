// @flow
import React, { useEffect, useState, useContext, type Node } from "react";
import { Helmet } from "react-helmet";
import { Client } from "api";
import UrlPrefixContext from "components/UrlPrefixContext";
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
  selectChaptersForManga
} from "redux-ducks/chapters";
import {
  fetchChapters,
  updateChapters
} from "redux-ducks/chapters/actionCreators";
import { makeStyles } from "@material-ui/styles";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import { selectSource } from "redux-ducks/sources";

type RouterProps = { match: { params: Object } };

const useStyles = makeStyles({
  // use flexbox to allow virtualized chapter list fill the remaining
  // viewport height with flex-grow: 1
  parent: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }
});

const MangaInfo = ({ match: { params } }: RouterProps) => {
  const classes = useStyles();

  // it is safe to consider this the back URL
  const urlPrefix = useContext(UrlPrefixContext);

  // initialTab only sets the state on initialization
  const [tabValue, setTabValue] = useState(initialTab(urlPrefix));

  const mangaId = parseInt(params.mangaId, 10);

  const mangaInfo = useSelector(state => selectMangaInfo(state, mangaId));
  const chapters = useSelector(state =>
    selectFilteredSortedChapters(state, mangaId)
  );
  const source = useSelector(state =>
    selectSource(state, mangaInfo ? mangaInfo.sourceId : "")
  );
  const isMangaInfosLoading = useSelector(selectIsMangaInfosLoading);
  const isChaptersLoading = useSelector(selectIsChaptersLoading);

  const dispatch = useDispatch();

  const store = useStore();

  useEffect(() => {
    dispatch(fetchChapters(mangaId)).then(() => {
      // The first time a manga is loaded by the server, it will not have any chapters scraped.
      // So check if we found any chapters. If not, try scraping the site once.

      // Check for chapters directly in the store instead of relying on useSelector().
      // This is because the useSelector() value doesn't update until the next render
      // which occurs AFTER this useEffect() promise runs.
      const chaptersInStore = selectChaptersForManga(store.getState(), mangaId);

      if (!chaptersInStore.length) {
        // return promise so next .then()'s wait until the data has finished fetching
        return dispatch(updateChapters(mangaId));
      }
      return null;
    });

    dispatch(fetchMangaInfo(mangaId)).then(() => {
      // Update manga manually if the server has not fetched the data for this manga yet
      if (mangaInfo && !mangaInfo.initialized) {
        dispatch(updateMangaInfo(mangaId));
      }

      dispatch(fetchSources());
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeTab = (event: SyntheticEvent<>, newValue: number) => {
    setTabValue(newValue);
  };

  const tabContent = (): Node => {
    if (mangaInfo == null) return null;

    const numChapters: number = chapters ? chapters.length : 0;

    if (tabValue === 0) {
      return (
        <MangaInfoDetails
          mangaInfo={mangaInfo}
          numChapters={numChapters}
          source={source}
        />
      );
    }
    if (tabValue === 1) {
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
        onBackClick={urlPrefix}
      />

      {tabContent()}

      {(isMangaInfosLoading || isChaptersLoading) && <FullScreenLoading />}
    </div>
  );
};

// Helper function
function initialTab(urlPrefix) {
  if (urlPrefix === Client.library()) {
    return 1;
  }
  if (urlPrefix === Client.catalogue()) {
    return 0;
  }
  // fallback just in case
  return 0;
}

export default MangaInfo;
