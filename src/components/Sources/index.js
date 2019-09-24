// @flow
import React, { useEffect, useRef, useState } from "react";
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

  // Move enabled languages to the top, but only on initial load
  const reorderedSourceLanguages = useEnabledLangFirstOnLoad(
    sourceLanguages,
    enabledLanguages
  );

  return (
    <>
      <Helmet title="Sources - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <BackButton onBackClick={Client.catalogues()} />

          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            Sources
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        {reorderedSourceLanguages.map(lang => (
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

function useEnabledLangFirstOnLoad(
  sourceLanguages: $ReadOnlyArray<string>,
  enabledLanguages: $ReadOnlyArray<string>
) {
  // starting with an empty array to mimic sourceLanguages's type
  const [reorderedLang, setReorderedLang] = useState<$ReadOnlyArray<string>>(
    []
  );
  const alreadySortedRef = useRef(false);

  useEffect(() => {
    if (alreadySortedRef.current) return;

    const sortedEnabledLanguages = sourceLanguages.filter(lang =>
      enabledLanguages.includes(lang)
    );
    const sortedDisabledLanguages = sourceLanguages.filter(
      lang => !enabledLanguages.includes(lang)
    );

    setReorderedLang([...sortedEnabledLanguages, ...sortedDisabledLanguages]);

    // prevent any further changes of order, but only if we're sure sources were loaded
    if (reorderedLang.length > 0) {
      alreadySortedRef.current = true;
    }
  }, [sourceLanguages, enabledLanguages, reorderedLang.length]);

  return reorderedLang;
}

export default Sources;
