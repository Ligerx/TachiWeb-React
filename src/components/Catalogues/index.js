// @flow
import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import { Client } from "api";
import Link from "components/Link";
import MenuDrawer from "components/MenuDrawer";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import SourceList from "components/Catalogues/SourceList";
import CatalogueSearchBar from "components/Catalogues/CatalogueSearchBar";
import { langPrettyPrint } from "components/utils";
import { useSources } from "apiHooks";
import queryString from "query-string";
import {
  selectSourcesEnabledLanguages,
  selectHiddenSources
} from "redux-ducks/settings";
import {
  sortedAndFilteredSourcesByLanguage,
  languagesForSourcesByLanguage
} from "apiHooks/sourceUtils";

const useStyles = makeStyles({
  belowSearch: { marginBottom: 32 }
});

const Catalogues = () => {
  const classes = useStyles();

  const history = useHistory();

  const hiddenSources = useSelector(selectHiddenSources);
  const enabledLanguages = useSelector(selectSourcesEnabledLanguages);

  const { data: sources } = useSources();

  const handleSearchSubmit = (newSearchQuery: string) => {
    history.push({
      pathname: Client.cataloguesSearchAll(),
      search: queryString.stringify(
        { search: newSearchQuery },
        { skipEmptyString: true }
      )
    });
  };

  if (sources == null) {
    return <FullScreenLoading />;
  }

  const sortedSourcesByLanguage = sortedAndFilteredSourcesByLanguage(
    sources,
    hiddenSources,
    enabledLanguages
  );

  const sourceLanguages = languagesForSourcesByLanguage(
    sortedSourcesByLanguage
  );

  return (
    <>
      <Helmet title="Catalogues - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <MenuDrawer />

          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            Catalogues
          </Typography>

          <Tooltip title="Sources">
            <IconButton component={Link} to={Client.sources()}>
              <Icon>settings</Icon>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <CatalogueSearchBar
          useLocalState
          onSubmit={handleSearchSubmit}
          textFieldProps={{ label: "Search all catalogues" }}
        />
        {/* Hacky way of adding some margin. SearchBar doesn't
            work right with passed in classNames [Sept 18, 2019] */}
        <div className={classes.belowSearch} />

        {sourceLanguages.map(lang => (
          <div key={lang}>
            <Typography variant="h5" gutterBottom>
              {langPrettyPrint(lang)}
            </Typography>
            <SourceList sources={sortedSourcesByLanguage[lang]} />
          </div>
        ))}
      </Container>
    </>
  );
};

export default Catalogues;
