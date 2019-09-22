// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import { Client } from "api";
import CatalogueSearchResultsPaper from "components/Catalogues/CatalogueSearchResultsPaper";
import CatalogueSearchBar from "components/Catalogues/CatalogueSearchBar";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import {
  selectIsSourcesLoading,
  selectSourcesEnabledLanguagesSorted,
  selectEnabledSourcesByLanguage,
  selectEnabledSources
} from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import {
  fetchCatalogue,
  resetCataloguesAndFilters,
  updateSearchQuery
} from "redux-ducks/catalogues/actionCreators";

type RouterProps = {
  match: { url: string },
  history: { push: Function }
};
type Props = RouterProps;

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

const CataloguesSearchAllPage = ({ match: { url }, history }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const sourcesAreLoading = useSelector(selectIsSourcesLoading);
  const sourceLanguages = useSelector(selectSourcesEnabledLanguagesSorted);
  const sourcesByLanguage = useSelector(selectEnabledSourcesByLanguage);
  const enabledSources = useSelector(selectEnabledSources);

  useEffect(() => {
    dispatch(fetchSources()).then(() => {
      enabledSources.forEach(source => {
        dispatch(fetchCatalogue(source.id, { useCachedData: true }));
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (searchQuery: string) => {
    dispatch(updateSearchQuery(searchQuery));

    enabledSources.forEach(source => {
      dispatch(fetchCatalogue(source.id, { restartSearch: true }));
    });
  };

  const handleBackToCatalogues = () => {
    // Cleanup data when going from catalogues search -> catalogues
    dispatch(resetCataloguesAndFilters());

    history.push(Client.catalogues());
  };

  return (
    <>
      <Helmet title="Catalogues Search - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <IconButton onClick={handleBackToCatalogues}>
            <Icon>arrow_back</Icon>
          </IconButton>

          <Typography variant="h6" style={{ flex: 1 }}>
            Catalogues Search
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <CatalogueSearchBar
          onSubmit={handleSearchSubmit}
          textFieldProps={{ label: "Search all catalogues" }}
        />
        {/* Hacky way of adding some margin. SearchBar doesn't
            work right with passed in classNames [Sept 18, 2019] */}
        <div className={classes.belowSearch} />

        {sourceLanguages.map(lang => {
          const sources = sourcesByLanguage[lang];
          if (sources == null) return null;

          return sources.map(source => (
            <div key={source.id} className={classes.catalogueSearchResults}>
              <Typography variant="h5" gutterBottom>
                {`${source.name} (${lang})`}
              </Typography>
              <CatalogueSearchResultsPaper
                sourceId={source.id}
                urlPrefix={url}
              />
            </div>
          ));
        })}
      </Container>

      {sourcesAreLoading && <FullScreenLoading />}
    </>
  );
};

export default CataloguesSearchAllPage;
