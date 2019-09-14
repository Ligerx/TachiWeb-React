// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Waypoint from "react-waypoint";
import { Helmet } from "react-helmet";
import isEmpty from "lodash/isEmpty";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import CatalogueMangaCard from "components/Catalogues/CatalogueMangaCard";
import DynamicSourceFilters from "components/Filters/DynamicSourceFilters";
import CatalogueHeader from "components/Catalogues/CatalogueHeader";
import CenteredLoading from "components/Loading/CenteredLoading";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import { selectIsSourcesLoading, selectSources } from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import {
  selectIsCatalogueLoading,
  selectCatalogueSourceId,
  selectCatalogueHasNextPage,
  selectCatalogueMangaInfos
} from "redux-ducks/catalogue";
import {
  fetchCatalogue,
  fetchNextCataloguePage
} from "redux-ducks/catalogue/actionCreators";
import { fetchFilters } from "redux-ducks/filters/actionCreators";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

// TODO: keep previous scroll position when going back from MangaInfo -> Catalogue
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

const CataloguesPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Sources data
  const sources = useSelector(selectSources);
  // Catalogue data
  const hasNextPage = useSelector(selectCatalogueHasNextPage);
  const sourceId = useSelector(selectCatalogueSourceId);
  // Library data
  const mangaLibrary = useSelector(selectCatalogueMangaInfos);
  // Fetching data
  const sourcesAreLoading = useSelector(selectIsSourcesLoading);
  const catalogueIsLoading = useSelector(selectIsCatalogueLoading);

  useEffect(() => {
    // Only reload on component mount if it's missing data, otherwise show cached data
    if (isEmpty(sources) || sourceId == null) {
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

  const noMoreResults =
    !catalogueIsLoading && !sourcesAreLoading && !hasNextPage;

  return (
    <>
      <Helmet title="Catalogues - TachiWeb" />

      <CatalogueHeader />

      <Container>
        <DynamicSourceFilters />

        <Grid container spacing={2}>
          {mangaLibrary.map(manga => (
            <CatalogueMangaCard key={manga.id} manga={manga} />
          ))}
        </Grid>

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
      </Container>
    </>
  );
};

export default CataloguesPage;
