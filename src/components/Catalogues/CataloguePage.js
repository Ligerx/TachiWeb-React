// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Waypoint from "react-waypoint";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Client } from "api";
import CatalogueMangaCard from "components/Catalogues/CatalogueMangaCard";
import DynamicSourceFilters from "components/Filters/DynamicSourceFilters";
import CenteredLoading from "components/Loading/CenteredLoading";
import BackButton from "components/BackButton";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import { selectIsSourcesLoading, selectSource } from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import {
  selectCatalogueManga,
  selectIsCatalogueLoading,
  selectCatalogueSourceId,
  selectCatalogueHasNextPage
} from "redux-ducks/catalogues";
import { fetchCatalogue } from "redux-ducks/catalogues/actionCreators";
import { fetchFilters } from "redux-ducks/filters/actionCreators";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

// TODO: cleanup filters, search query, and this source on going back

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

type RouterProps = { match: { params: { sourceId: string } } };
type Props = RouterProps;

const CataloguePage = ({
  match: {
    params: { sourceId }
  }
}: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const source = useSelector(state => selectSource(state, sourceId));
  const sourceName = source == null ? "" : source.name;

  const mangaLibrary = useSelector(state =>
    selectCatalogueManga(state, sourceId)
  );
  const hasNextPage = useSelector(state =>
    selectCatalogueHasNextPage(state, sourceId)
  );
  const catalogueIsLoading = useSelector(selectIsCatalogueLoading);

  useEffect(() => {
    dispatch(fetchSources());
    dispatch(fetchCatalogue(sourceId));
    dispatch(fetchFilters());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadNextPage = () => {
    if (catalogueIsLoading) return;
    dispatch(fetchCatalogue(sourceId));
  };

  const noMoreResults = !catalogueIsLoading && !hasNextPage;

  return (
    <>
      <Helmet title={`${sourceName} - TachiWeb`} />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <BackButton onBackClick={Client.catalogues()} />
        </Toolbar>

        <Typography variant="h6" style={{ flex: 1 }}>
          {sourceName}
        </Typography>
      </AppBar>

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

export default withRouter(CataloguePage);
