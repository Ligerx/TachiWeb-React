// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import {
  selectIsSourcesLoading,
  selectSourcesEnabledLanguagesSorted,
  selectEnabledSourcesByLanguage
} from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import { updateSearchQuery } from "redux-ducks/catalogues/actionCreators";

type RouterProps = {
  history: { push: Function }
};
type Props = RouterProps;

const useStyles = makeStyles({
  belowSearch: { marginBottom: 32 }
});

const Catalogues = ({ history }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const sourcesAreLoading = useSelector(selectIsSourcesLoading);
  const sourceLanguages = useSelector(selectSourcesEnabledLanguagesSorted);
  const sourcesByLanguage = useSelector(selectEnabledSourcesByLanguage);

  useEffect(() => {
    dispatch(fetchSources());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchSubmit = (searchQuery: string) => {
    dispatch(updateSearchQuery(searchQuery));
    history.push(Client.cataloguesSearchAll());
  };

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

      {sourcesAreLoading && <FullScreenLoading />}
    </>
  );
};

export default withRouter(Catalogues);
