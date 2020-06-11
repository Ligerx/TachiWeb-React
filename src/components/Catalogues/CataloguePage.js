// @flow
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
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
import { fetchSources } from "redux-ducks/sources/actionCreators";
import { selectCatalogueSearchQuery } from "redux-ducks/catalogues";
import {
  fetchCatalogue,
  resetCataloguesAndFilters
} from "redux-ducks/catalogues/actionCreators";
import {
  selectIsFiltersLoading,
  selectFiltersLength,
  selectLastUsedFilters
} from "redux-ducks/filters";
import { fetchFilters } from "redux-ducks/filters/actionCreators";
import { useCataloguePages, useSource } from "apiHooks";

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

  // NEW STUFF ==========

  // TODO: Hack/optimization
  // I need to select the searchQuery from redux at the top level of this component tree to pass into useCataloguePages.
  // However, that means that any change of input into the search bar will cause everything to rerender.
  // Using useStore doesn't cause any rerenders and I can use it to manually pull in the redux searchQuery to initialize my local state.
  const store = useStore();

  const [searchQuery, setSearchQuery] = useState(
    selectCatalogueSearchQuery(store.getState())
  );

  const { data: source } = useSource(sourceId);
  const sourceName = source == null ? "" : source.name;

  const lastUsedFilters = useSelector(selectLastUsedFilters);

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useCataloguePages(
    sourceId,
    searchQuery,
    lastUsedFilters,
    mangaInfos =>
      mangaInfos.map(mangaInfo => (
        <CatalogueMangaCard
          key={mangaInfo.id}
          to={Client.manga(url, mangaInfo.id)}
          manga={mangaInfo}
        />
      ))
  );
  // ====================

  const filtersLength = useSelector(selectFiltersLength);
  const filtersIsLoading = useSelector(selectIsFiltersLoading);

  const isLoading = filtersIsLoading || source == null || isLoadingMore;

  // TODO: remove parts of this that aren't necessary
  useEffect(() => {
    dispatch(fetchSources());
    dispatch(fetchCatalogue(sourceId, { useCachedData: true }));

    if (filtersLength === 0) {
      dispatch(fetchFilters(sourceId));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (newSearchQuery: string) => {
    // for simplicity, I'm not relying on the value stored inside redux
    setSearchQuery(newSearchQuery);
  };

  const handleLoadNextPage = () => {
    if (isReachingEnd) return;
    loadMore();
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
          {pages}
        </Grid>

        {pages.length > 0 && (
          <Waypoint onEnter={handleLoadNextPage} bottomOffset={-300} />
        )}

        {isLoading && <CenteredLoading className={classes.loading} />}
        {isReachingEnd && (
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
