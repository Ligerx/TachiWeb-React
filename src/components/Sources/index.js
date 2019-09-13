// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import { Client } from "api";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import BackButton from "components/BackButton";
import SourcesByLanguage from "components/Sources/SourcesByLanguage";
import {
  selectSourcesByLanguage,
  selectSourceLanguages,
  selectIsSourcesLoading
} from "redux-ducks/sources";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import {
  selectSourcesEnabledLanguages,
  selectHiddenSources
} from "redux-ducks/settings";

const Sources = () => {
  // Sources
  const sourceLanguages = useSelector(selectSourceLanguages);
  const sourcesByLanguage = useSelector(selectSourcesByLanguage);
  const sourcesAreLoading = useSelector(selectIsSourcesLoading);

  // Preferences
  const enabledLanguages = useSelector(selectSourcesEnabledLanguages);
  const hiddenSources = useSelector(selectHiddenSources);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSources());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet title="Sources - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <BackButton onBackClick={Client.catalogue()} />

          <Typography variant="h6" style={{ flex: 1 }}>
            Sources
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        {sourceLanguages.map(lang => (
          <SourcesByLanguage
            key={lang}
            lang={lang}
            sources={sourcesByLanguage[lang]}
            isEnabled={enabledLanguages.includes(lang)}
            hiddenSources={hiddenSources}
          />
        ))}
      </Container>

      {sourcesAreLoading && <FullScreenLoading />}
    </>
  );
};

export default Sources;
