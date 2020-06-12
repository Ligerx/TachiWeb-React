// @flow
import React, { useEffect, useState, useRef } from "react";
import Waypoint from "react-waypoint";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
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
import CatalogueSearchBar from "components/Catalogues/CatalogueSearchBar";
import { useCataloguePages, useSource, useFilters } from "apiHooks";
import queryString from "query-string-es5";
import BackButton from "components/BackButton";
import type { FilterAnyType } from "types/filters";

type RouterProps = {
  match: {
    params: { sourceId: string },
    url: string
  },
  location: { pathname: string, search: string },
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

type QueryParams = {
  // encoded string
  search?: string,
  // encoded array of json-strings
  // JSON.stringify and JSON.parse accepts arrays of objects so I'll just encode the entire array
  filters?: string
};

const CataloguePage = ({
  match: {
    params: { sourceId },
    url
  },
  location: { pathname, search },
  history
}: Props) => {
  const classes = useStyles();

  const parsedSearch: QueryParams = queryString.parse(search);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const newSearchQuery = parsedSearch.search
      ? uriToString(parsedSearch.search)
      : "";
    setSearchQuery(newSearchQuery);
  }, [parsedSearch.search]);

  const { data: initialFilters } = useFilters(sourceId);

  const [filters, setFilters] = useState<FilterAnyType[]>([]);

  // Save a copy of initial filters into state when viewing this page with no filters in the search query
  const alreadySavedFiltersRef = useRef(false);
  useEffect(() => {
    if (initialFilters == null) return;
    if (parsedSearch.filters != null) return;
    if (alreadySavedFiltersRef.current) return;

    setFilters(initialFilters);
    alreadySavedFiltersRef.current = true;
  }, [initialFilters, parsedSearch.filters]);

  useEffect(() => {
    const newFilters = parsedSearch.filters
      ? (uriToJSON(parsedSearch.filters): FilterAnyType[])
      : [];
    setFilters(newFilters);
  }, [parsedSearch.filters]);

  const { data: source } = useSource(sourceId);
  const sourceName = source == null ? "" : source.name;

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useCataloguePages(
    sourceId,
    searchQuery,
    filters,
    mangaInfos =>
      mangaInfos.map(mangaInfo => (
        <CatalogueMangaCard
          key={mangaInfo.id}
          to={Client.manga(url, mangaInfo.id)}
          manga={mangaInfo}
        />
      ))
  );

  const isLoading = initialFilters == null || source == null || isLoadingMore;

  const handleSearchSubmit = (newSearchQuery: string) => {
    history.push({
      pathname,
      search: queryString.stringify({
        search: stringToURI(newSearchQuery),
        filters: jsonToURI(filters)
      })
    });
  };

  const handleLoadNextPage = () => {
    if (isReachingEnd) return;
    loadMore();
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
        <CatalogueSearchBar
          useLocalState
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

export default withRouter(CataloguePage);
