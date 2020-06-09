// @flow
import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import { Client } from "api";
import UrlPrefixContext from "components/UrlPrefixContext";
import MangaInfoHeader from "components/MangaInfo/MangaInfoHeader";
import MangaInfoDetails from "components/MangaInfo/MangaInfoDetails";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import ContinueReadingButton from "components/MangaInfo/ContinueReadingButton";
import MangaInfoChapterList from "components/MangaInfo/ChapterList";
import CenterHorizontally from "components/CenterHorizontally";
import { makeStyles } from "@material-ui/styles";
import {
  useMangaInfo,
  useChapters,
  useUpdateChapters,
  useUpdateMangaInfo,
  useSource
} from "apiHooks";
import type { ChapterType } from "types";
import filterSortChapters from "./utils";

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

  const { data: mangaInfo } = useMangaInfo(mangaId);
  const { data: source } = useSource(mangaInfo?.sourceId);
  const { data: unsortedOrFilteredChapters } = useChapters(mangaId);

  // TODO may need to memoize this if it's laggy
  const isChaptersAndMangaLoaded =
    unsortedOrFilteredChapters != null && mangaInfo != null;

  const chapters: ?(ChapterType[]) = isChaptersAndMangaLoaded
    ? filterSortChapters(unsortedOrFilteredChapters, mangaInfo.flags)
    : null;

  const updateChapters = useUpdateChapters();
  const updateMangaInfo = useUpdateMangaInfo();

  useEffect(() => {
    // The first time a manga is loaded by the server, it will not have any chapters scraped.
    // So check if we found any chapters. If not, try scraping the site once.
    if (chapters != null && chapters.length === 0) {
      updateChapters(mangaId);
    }
  }, [chapters, mangaId, updateChapters]);

  useEffect(() => {
    // Update manga manually if the server has not fetched the data for this manga yet
    if (mangaInfo != null && !mangaInfo.initialized) {
      updateMangaInfo(mangaId);
    }
  }, [mangaId, mangaInfo, updateMangaInfo]);

  const handleChangeTab = (event: SyntheticEvent<>, newValue: number) => {
    setTabValue(newValue);
  };

  if (mangaInfo == null || chapters == null) return <FullScreenLoading />;

  return (
    <div className={classes.parent}>
      <Helmet title={`${mangaInfo.title} - TachiWeb`} />

      <MangaInfoHeader
        mangaInfo={mangaInfo}
        tabValue={tabValue}
        handleChangeTab={handleChangeTab}
        onBackClick={urlPrefix}
      />

      {tabValue === 0 && (
        <MangaInfoDetails
          mangaInfo={mangaInfo}
          numChapters={chapters ? chapters.length : 0}
          source={source}
        />
      )}
      {tabValue === 1 && (
        <>
          <CenterHorizontally>
            <ContinueReadingButton mangaId={mangaInfo.id} />
          </CenterHorizontally>

          <MangaInfoChapterList chapters={chapters} mangaInfo={mangaInfo} />
        </>
      )}
    </div>
  );
};

// Helper function
function initialTab(urlPrefix) {
  if (urlPrefix === Client.library()) {
    return 1;
  }
  if (urlPrefix === Client.catalogues()) {
    return 0;
  }
  // fallback just in case
  return 0;
}

export default MangaInfo;
