// @flow
import { createSelector } from "reselect";
import { createLoadingSelector } from "redux-ducks/loading";
import type { SourceMap } from "types";
import type { Source } from "@tachiweb/api-client";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { withDeletedKeys } from "redux-ducks/utils";
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
    Object.values(sourcesByLanguage).forEach((sources: Array<Source>) => {
      sources.sort((a, b) => {
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
