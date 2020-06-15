// @flow
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
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
  selectSourcesEnabledLanguages,
  selectHiddenSources
} from "redux-ducks/settings";
import { useSources } from "apiHooks";
import {
  sortSources,
  languagesForSources,
  sourcesByLanguage
} from "apiHooks/sourceUtils";
import type { Source } from "@tachiweb/api-client";

const Sources = () => {
  const enabledLanguages = useSelector(selectSourcesEnabledLanguages);
  const hiddenSources = useSelector(selectHiddenSources);

  const { data: sources } = useSources();

  const languages = useLanguagesSortedOnce(sources, enabledLanguages);

  if (sources == null) {
    return <FullScreenLoading />;
  }

  const sortedSourcesByLanguage = sourcesByLanguage(sortSources(sources));

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
        {languages.map(lang => (
          <SourcesByLanguage
            key={lang}
            lang={lang}
            sources={sortedSourcesByLanguage[lang]}
            isEnabled={enabledLanguages.includes(lang)}
            hiddenSources={hiddenSources}
          />
        ))}
      </Container>
    </>
  );
};

/**
 * Used to move enabled languages to the top, but only on initial load.
 * This keeps the data order stable when staying on the same page and enabling/disabling languages.
 */
function useLanguagesSortedOnce(
  sources: ?(Source[]),
  enabledLanguages: string[]
) {
  const [reorderedLanguages, setReorderedLanguages] = useState<string[]>([]);
  const alreadySortedRef = useRef(false);

  useEffect(() => {
    if (alreadySortedRef.current) return;
    if (sources == null) return;
    if (sources.length === 0) return;

    const languages = languagesForSources(sources);

    const sortedEnabledLanguages = enabledLanguages.slice().sort();
    const sortedDisabledLanguages = [...new Set(languages)]
      .filter(lang => !enabledLanguages.includes(lang))
      .slice()
      .sort();

    setReorderedLanguages([
      ...sortedEnabledLanguages,
      ...sortedDisabledLanguages
    ]);

    alreadySortedRef.current = true;
  }, [enabledLanguages, sources]);

  return reorderedLanguages;
}

export default Sources;
