// @flow
import React, { useEffect, useState, useRef } from "react";
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

  // The below loading statuses are pulled and modified from an example on github
  // https://github.com/vercel/swr/pull/435
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
    if (isReachingEnd) return;
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
          textFieldProps={{ label: "Search for manga" }}
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

        {page > 0 && (
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

function useSearchQueryFromQueryParam(searchQueryParam: ?string) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const newSearchQuery = searchQueryParam
      ? uriToString(searchQueryParam)
      : "";
    setSearchQuery(newSearchQuery);
  }, [searchQueryParam]);

  return searchQuery;
}

function useFiltersFromQueryParam(
  initialFilters: FilterAnyType[],
  filtersQueryParam: ?string
) {
  const [filters, setFilters] = useState<FilterAnyType[]>([]);

  // Save a copy of initial filters into state when viewing this page with no filters in the search query
  const alreadySavedFiltersRef = useRef(false);
  useEffect(() => {
    if (initialFilters == null) return;
    if (filtersQueryParam != null) return;
    if (alreadySavedFiltersRef.current) return;

    setFilters(initialFilters);
    alreadySavedFiltersRef.current = true;
  }, [initialFilters, filtersQueryParam]);

  useEffect(() => {
    const newFilters = filtersQueryParam
      ? (uriToJSON(filtersQueryParam): FilterAnyType[])
      : [];
    setFilters(newFilters);
  }, [filtersQueryParam]);

  return filters;
}

// URL search query can't support nested objects like filters. So encode it when putting it into the URL and vice versa.
// https://stackoverflow.com/questions/9909620/convert-javascript-object-into-uri-encoded-string
/**
 * Seems to support arrays in addition to objects
 */
function jsonToURI(json: Object): string {
  return encodeURIComponent(JSON.stringify(json));
}

/**
 * Seems to support arrays in addition to objects
 */
function uriToJSON(urijson: string): Object {
  return JSON.parse(decodeURIComponent(urijson));
}

function stringToURI(string: string): string {
  return encodeURIComponent(string);
}

function uriToString(uriString: string): string {
  return decodeURIComponent(uriString);
}

export default CataloguePage;
