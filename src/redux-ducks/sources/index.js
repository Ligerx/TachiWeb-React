// @flow
import { createSelector } from "reselect";
import isEmpty from "lodash/isEmpty";
import { createLoadingSelector } from "redux-ducks/loading";
import type { SourceMap } from "types";
import type { Source } from "@tachiweb/api-client";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { withDeletedKeys } from "redux-ducks/utils";
import {
  selectSourcesEnabledLanguagesSorted,
  selectHiddenSources
} from "redux-ducks/settings";
import { FETCH_SOURCES, FETCH_SUCCESS, REMOVE_SOURCES } from "./actions";

// ================================================================================
// Reducer
// ================================================================================

type State = SourceMap;

export default function sourcesReducer(
  state: State = {},
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return sourceArrayToObject(action.payload);

    case REMOVE_SOURCES:
      return withDeletedKeys<string, Source>(state, action.sourceIds);

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsSourcesLoading = createLoadingSelector([FETCH_SOURCES]);

export const selectSources = (state: GlobalState): State => state.sources;

export const selectSource = (state: GlobalState, sourceId: string): ?Source =>
  state.sources[sourceId];

/**
 * Language keys have not been sorted.
 * Each array of sources is sorted alphabetically by source.name
 */
export const selectSourcesByLanguage: GlobalState => $ReadOnly<{
  [lang: string]: Array<Source>
}> = createSelector(
  [selectSources],
  (sources): $ReadOnly<{ [lang: string]: Array<Source> }> => {
    const sourcesByLanguage = {};

    // Create object { [lang]: [...sources] }
    Object.values(sources).forEach((source: Source) => {
      const lang = source.lang == null ? "noLang" : source.lang;

      if (sourcesByLanguage[lang] == null) {
        sourcesByLanguage[lang] = [];
      }
      sourcesByLanguage[lang].push(source);
    });

    // Sort each of the individual arrays by source name
    Object.values(sourcesByLanguage).forEach((s: Array<Source>) => {
      s.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });

    return sourcesByLanguage;
  }
);

/**
 * Languages are sorted alphabetically
 */
export const selectSourceLanguages: GlobalState => $ReadOnlyArray<string> = createSelector(
  [selectSourcesByLanguage],
  (sourcesByLanguage): $ReadOnlyArray<string> => {
    return Object.keys(sourcesByLanguage).sort();
  }
);

// Re-exporting this selector from settings since it makes more sense in context of sources
export { selectSourcesEnabledLanguagesSorted };

/**
 * While language keys are sorted alphabetically, you should probably still rely on
 * `selectSourcesEnabledLanguagesSorted()` just in case the browser doesn't guarantee
 * key order is retained.
 */
export const selectEnabledSourcesByLanguage: GlobalState => $ReadOnly<{
  [lang: string]: Array<Source>
}> = createSelector(
  [
    selectSourcesByLanguage,
    selectSourcesEnabledLanguagesSorted,
    selectHiddenSources
  ],
  (
    sourcesByLanguage,
    enabledLanguages,
    hiddenSources
  ): $ReadOnly<{ [lang: string]: Array<Source> }> => {
    // selectSourcesByLanguage() is derived from source data
    // selectSourcesEnabledLanguagesSorted() and selectHiddenSources() are derived from settings data
    // Since these are fetched at separate times, there is a small 'race condition' where settings
    // seletors data is available but sourcesByLanguage() could return {}.
    // But it SHOULD be safe to assume that once source data is loaded, everything should run smooth.
    if (isEmpty(sourcesByLanguage)) return sourcesByLanguage; // return {}

    enabledLanguages.reduce((obj, lang) => {
      const sources = sourcesByLanguage[lang];

      const enabledSources = sources.filter(
        source => !hiddenSources.includes(source)
      );
      return { ...obj, [lang]: enabledSources };
    }, {});

    return sourcesByLanguage;
  }
);

// ================================================================================
// Helper Functions
// ================================================================================
function sourceArrayToObject(sourceArray: Array<Source>): SourceMap {
  const sourceObject = {};
  sourceArray.forEach(source => {
    sourceObject[source.id] = source;
  });
  return sourceObject;
}
