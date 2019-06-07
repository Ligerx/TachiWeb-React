// @flow
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Waypoint from "react-waypoint";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet";
import type { FilterAnyType } from "types/filters";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import MangaGrid from "components/MangaGrid";
import CatalogueMangaCard from "components/Catalogue/CatalogueMangaCard";
import DynamicSourceFilters from "components/Filters/DynamicSourceFilters";
import ResponsiveGrid from "components/ResponsiveGrid";
import CatalogueHeader from "components/Catalogue/CatalogueHeader";
import CenteredLoading from "components/Loading/CenteredLoading";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import {
  selectIsSourcesLoading,
  selectSources,
  fetchSources
} from "redux-ducks/sources";
import {
  selectIsCatalogueLoading,
  selectCatalogueSourceId,
  selectCatalogueHasNextPage,
  selectCatalogueSearchQuery,
  selectCatalogueMangaInfos,
  fetchCatalogue,
  fetchNextCataloguePage,
  resetCatalogue,
  updateSearchQuery,
  changeSourceId
} from "redux-ducks/catalogue";
import {
  selectCurrentFilters,
  fetchFilters,
  resetFilters,
  updateLastUsedFilters,
  updateCurrentFilters
} from "redux-ducks/filters";

// TODO: keep previous scroll position when going back from MangaInfo -> Catalogue

// FIXME: If you type something into the search bar,
//        then delete everything, searching breaks (no results)

// TODO: If you update search, then change it back to it's original value, don't search again?

const useStyles = makeStyles({
  loading: {
    marginTop: 24,
    marginBottom: 40
  },
  noMoreResults: {
    marginTop: 40,
    marginBottom: 60
  }
});

const Catalogue = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Sources data
  const sources = useSelector(selectSources);
  // Catalogue data
  const hasNextPage = useSelector(selectCatalogueHasNextPage);
  const sourceId = useSelector(selectCatalogueSourceId);
  // Library data
  const mangaLibrary = useSelector(selectCatalogueMangaInfos);
  // Filter data
  const currentFilters = useSelector(selectCurrentFilters);
  // Fetching data
  const sourcesAreLoading = useSelector(selectIsSourcesLoading);
  const catalogueIsLoading = useSelector(selectIsCatalogueLoading);

  useEffect(() => {
    // Only reload on component mount if it's missing data, otherwise show cached data
    if (sources.length === 0 || sourceId == null) {
      dispatch(fetchSources()).then(() => {
        dispatch(fetchCatalogue());
        dispatch(fetchFilters());
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadNextPage = () => {
    if (hasNextPage && !catalogueIsLoading) {
      dispatch(fetchNextCataloguePage());
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleFilterChange = (newFilters: Array<FilterAnyType>) => {
    dispatch(updateCurrentFilters(newFilters));
  };

  const handleSearchFilters = () => {
    dispatch(updateLastUsedFilters()); // Must come before fetchCatalogue. This is a synchronous function.
    dispatch(fetchCatalogue());
  };

  const noMoreResults =
    !catalogueIsLoading && !sourcesAreLoading && !hasNextPage;

  return (
    <React.Fragment>
      <Helmet title="Catalogue - TachiWeb" />

      <CatalogueHeader />

      <ResponsiveGrid>
        <DynamicSourceFilters
          filters={currentFilters}
          onResetClick={handleResetFilters}
          onSearchClick={handleSearchFilters}
          onFilterChange={handleFilterChange}
        />
      </ResponsiveGrid>

      <MangaGrid
        mangaLibrary={mangaLibrary}
        cardComponent={<CatalogueMangaCard />}
      />
      {mangaLibrary.length > 0 && (
        <Waypoint onEnter={handleLoadNextPage} bottomOffset={-300} />
      )}

      {catalogueIsLoading && <CenteredLoading className={classes.loading} />}
      {sourcesAreLoading && <FullScreenLoading />}
      {noMoreResults && (
        <Typography
          variant="caption"
          display="block"
          align="center"
          className={classes.noMoreResults}
        >
          No more results
        </Typography>
      )}
    </React.Fragment>
  );
};

export default Catalogue;
