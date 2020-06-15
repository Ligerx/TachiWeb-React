// @flow
import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import { Client } from "api";
import CatalogueSearchResults from "components/Catalogues/CatalogueSearchResults";
import LocalStateSearchBar from "components/Catalogues/LocalStateSearchBar";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import {
  selectSourcesEnabledLanguages,
  selectHiddenSources
} from "redux-ducks/settings";
import type { Source } from "@tachiweb/api-client";
import { useSources } from "apiHooks";
import { sortSources, filterEnabledSources } from "apiHooks/sourceUtils";
import queryString from "query-string";
import BackButton from "components/BackButton";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { stringToURI, useSearchQueryFromQueryParam } from "./utils";

const useStyles = makeStyles({
  loading: {
    marginTop: 24,
    marginBottom: 40
  },
  noMoreResults: {
    marginTop: 40,
    marginBottom: 60
  },
  catalogueSearchResults: {
    marginBottom: 24
  },
  belowSearch: {
    marginBottom: 32
  }
});

type QueryParams = {
  // encoded string
  search?: string
};

const CataloguesSearchAllPage = () => {
  const classes = useStyles();

  const history = useHistory();
  const { pathname, search } = useLocation();
  const { url } = useRouteMatch();

  const parsedSearch: QueryParams = queryString.parse(search);

  const searchQuery = useSearchQueryFromQueryParam(parsedSearch.search);

  const hiddenSources = useSelector(selectHiddenSources);
  const enabledLanguages = useSelector(selectSourcesEnabledLanguages);
  const { data: allSources } = useSources();

  const sources: ?(Source[]) =
    allSources &&
    sortSources(
      filterEnabledSources(allSources, hiddenSources, enabledLanguages)
    );

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

  return (
    <>
      <Helmet title="Catalogues Search - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <BackButton onBackClick={Client.catalogues()} />

          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            Catalogues Search
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <LocalStateSearchBar
          value={searchQuery}
          onSubmit={handleSearchSubmit}
          textFieldProps={{ label: "Search all catalogues" }}
        />
        {/* Hacky way of adding some margin. SearchBar doesn't
            work right with passed in classNames [Sept 18, 2019] */}
        <div className={classes.belowSearch} />

        {sources &&
          sources.map(source => (
            <CatalogueSearchResults
              key={source.id}
              source={source}
              searchQuery={searchQuery}
              urlPrefix={url}
              className={classes.catalogueSearchResults}
            />
          ))}
      </Container>

      {allSources == null && <FullScreenLoading />}
    </>
  );
};

export default CataloguesSearchAllPage;
