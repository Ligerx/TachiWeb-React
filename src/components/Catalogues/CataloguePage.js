// @flow
import React from "react";
import Waypoint from "react-waypoint";
import { Helmet } from "react-helmet";
import {
  useHistory,
  useLocation,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Client } from "api";
import CatalogueMangaCard from "components/Catalogues/CatalogueMangaCard";
import DynamicSourceFilters from "components/Filters/DynamicSourceFilters";
import CenteredLoading from "components/Loading/CenteredLoading";
import LocalStateSearchBar from "components/Catalogues/LocalStateSearchBar";
import { useSource, useFilters, useCatalogueInfinite } from "apiHooks";
import queryString from "query-string";
import BackButton from "components/BackButton";
import type { FilterAnyType } from "types/filters";
import type { Manga } from "@tachiweb/api-client";
import {
  jsonToURI,
  stringToURI,
  useSearchQueryFromQueryParam,
  useFiltersFromQueryParam
} from "./utils";

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

type QueryParams = {
  // encoded string
  search?: string,
  // encoded array of json-strings
  // JSON.stringify and JSON.parse accepts arrays of objects so I'll just encode the entire array
  filters?: string
};

const CataloguePage = () => {
  const classes = useStyles();

  const history = useHistory();
  const { pathname, search } = useLocation();
  const { url } = useRouteMatch();
  const { sourceId } = useParams();

  const parsedSearch: QueryParams = queryString.parse(search);

  const searchQuery = useSearchQueryFromQueryParam(parsedSearch.search);

  const { data: initialFilters } = useFilters(sourceId);

  const filters = useFiltersFromQueryParam(
    initialFilters,
    parsedSearch.filters
  );

  const { data: source } = useSource(sourceId);
  const sourceName = source == null ? "" : source.name;

  const { data, error, page, setPage } = useCatalogueInfinite(
    sourceId,
    searchQuery,
    filters
  );

  const mangaInfos: ?(Manga[]) = data?.flatMap(
    cataloguePage => cataloguePage.mangas
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (data && typeof data[page - 1] === "undefined");
  const isReachingEnd = data && data[data.length - 1].hasNextPage === false;

  const isLoading = initialFilters == null || source == null || isLoadingMore;

  const handleSearchSubmit = (newSearchQuery: string) => {
    const newQuery = queryString.stringify(
      {
        ...parsedSearch,
        search: stringToURI(newSearchQuery)
      },
      { skipEmptyString: true }
    );

    history.push({
      pathname,
      search: newQuery
    });
  };

  const handleFilterSearchClick = (newFilters: FilterAnyType[]) => {
    const newQuery = queryString.stringify({
      ...parsedSearch,
      filters: jsonToURI(newFilters)
    });

    history.push({
      pathname,
      search: newQuery
    });
  };

  const handleLoadNextPage = () => {
    // Prevent incrementing the page # unintentionally if the waypoint happens to be triggered while you're loading other data.
    // Currently isLoadingMore relies on page, so accidentally incrementing it would cause
    // a loading spinner to always show even when no loading is happening.
    if (isLoading || isReachingEnd) return;
    setPage(page + 1);
  };

  return (
    <>
      <Helmet title={`${sourceName} - TachiWeb`} />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <BackButton onBackClick={Client.catalogues()} />

          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            {sourceName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <LocalStateSearchBar
          value={searchQuery}
          onSubmit={handleSearchSubmit}
          textFieldProps={{ label: "Search all catalogues" }}
        />
        <DynamicSourceFilters
          filters={filters}
          initialFilters={initialFilters}
          onSearchClick={handleFilterSearchClick}
          buttonProps={{ className: classes.filterButton }}
        />

        <Grid container spacing={2}>
          {mangaInfos &&
            mangaInfos.map(mangaInfo => (
              <CatalogueMangaCard
                key={mangaInfo.id}
                to={Client.manga(url, mangaInfo.id)}
                manga={mangaInfo}
              />
            ))}
        </Grid>

        {!isLoadingInitialData && !isReachingEnd && (
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

export default CataloguePage;
