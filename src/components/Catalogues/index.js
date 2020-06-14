// @flow
import React from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
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
import { selectSourcesEnabledLanguagesSorted } from "redux-ducks/sources";
import { useSources } from "apiHooks";
import groupBy from "lodash/groupBy";
import type { Source } from "@tachiweb/api-client";
import queryString from "query-string";

type RouterProps = {
  history: { push: Function }
};
type Props = RouterProps;

const useStyles = makeStyles({
  belowSearch: { marginBottom: 32 }
});

const Catalogues = ({ history }: Props) => {
  const classes = useStyles();

  const sourceLanguages = useSelector(selectSourcesEnabledLanguagesSorted);

  const { data: sources } = useSources();

  const handleSearchSubmit = (newSearchQuery: string) => {
    // dispatch(updateSearchQuery(searchQuery));
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

  const sourcesByLanguage: { [lang: string]: Source[] } = groupBy(
    sortByName(sources),
    source => source.lang
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
            <SourceList sources={sourcesByLanguage[lang]} />
          </div>
        ))}
      </Container>
    </>
  );
};

function sortByName(sources: Source[]): Source[] {
  return sources.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
}

export default withRouter(Catalogues);
