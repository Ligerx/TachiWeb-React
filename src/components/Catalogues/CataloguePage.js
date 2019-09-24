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
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Client } from "api";
import CatalogueMangaCard from "components/Catalogues/CatalogueMangaCard";
import DynamicSourceFilters from "components/Filters/DynamicSourceFilters";
import CenteredLoading from "components/Loading/CenteredLoading";
import CatalogueSearchBar from "components/Catalogues/CatalogueSearchBar";
import { selectIsSourcesLoading, selectSource } from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import {
  selectCatalogueManga,
  selectIsCatalogueLoading,
  selectCatalogueHasNextPage
} from "redux-ducks/catalogues";
import {
  fetchCatalogue,
  resetCataloguesAndFilters
} from "redux-ducks/catalogues/actionCreators";
import {
  selectIsFiltersLoading,
  selectFiltersLength
} from "redux-ducks/filters";
import { fetchFilters } from "redux-ducks/filters/actionCreators";

type RouterProps = {
  match: {
    params: { sourceId: string },
    url: string
  },
  history: { push: Function }
};
type Props = RouterProps;

const useStyles = makeStyles({
  filterButton: {
    marginTop: 16,
    marginBottom: 16,
    float: "right"
  },
  loading: {
    marginTop: 24,
    marginBottom: 40
  },
  noMoreResults: {
    marginTop: 40,
    marginBottom: 60
  }
});

const CataloguePage = ({
  match: {
    params: { sourceId },
    url
  },
  history
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
  const filtersLength = useSelector(selectFiltersLength);

  const catalogueIsLoading = useSelector(state =>
    selectIsCatalogueLoading(state, sourceId)
  );
  const sourcesIsLoading = useSelector(selectIsSourcesLoading);
  const filtersIsLoading = useSelector(selectIsFiltersLoading);

  const isLoading = catalogueIsLoading || sourcesIsLoading || filtersIsLoading;
  const noMoreResults = !catalogueIsLoading && !hasNextPage;

  useEffect(() => {
    dispatch(fetchSources());
    dispatch(fetchCatalogue(sourceId, { useCachedData: true }));

    if (filtersLength === 0) {
      dispatch(fetchFilters(sourceId));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = () => {
    dispatch(fetchCatalogue(sourceId, { restartSearch: true }));
  };

  const handleLoadNextPage = () => {
    if (catalogueIsLoading) return;
    dispatch(fetchCatalogue(sourceId));
  };

  const handleBackToCatalogues = () => {
    // Cleanup data when going from catalogue -> catalogues
    dispatch(resetCataloguesAndFilters());

    history.push(Client.catalogues());
  };

  return (
    <>
      <Helmet title={`${sourceName} - TachiWeb`} />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <IconButton onClick={handleBackToCatalogues}>
            <Icon>arrow_back</Icon>
          </IconButton>

          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            {sourceName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <CatalogueSearchBar
          onSubmit={handleSearchSubmit}
          textFieldProps={{ label: "Search for manga" }}
        />
        <DynamicSourceFilters
          sourceId={sourceId}
          buttonProps={{ className: classes.filterButton }}
        />

        <Grid container spacing={2}>
          {mangaLibrary.map(manga => (
            <CatalogueMangaCard
              key={manga.id}
              to={Client.manga(url, manga.id)}
              manga={manga}
            />
          ))}
        </Grid>

        {mangaLibrary.length > 0 && (
          <Waypoint onEnter={handleLoadNextPage} bottomOffset={-300} />
        )}

        {isLoading && <CenteredLoading className={classes.loading} />}
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
