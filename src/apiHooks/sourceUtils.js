// @flow
import type { Source } from "@tachiweb/api-client";
import sortBy from "lodash/sortBy";
import groupBy from "lodash/groupBy";

// NOTE: There exists a "Local manga" source that I'm not currently accounting for.
/*
{
  id: "0",
  name: "Local manga",
  requiresLogin: false,
  supportsLatest: true
}
*/

/**
 * Sorted and filtered.
 * @returns Object of languages pointing to arrays of sources.
 * The key `lang` is based on the source.lang ISO 639-1 compliant language code (two letters in lower case).
 */
export function sortedAndFilteredSourcesByLanguage(
  sources: Source[],
  hiddenSources: string[],
  enabledLanguages: string[]
) {
  const filteredSources = filterEnabledSources(
    sources,
    hiddenSources,
    enabledLanguages
  );
  const sortedSources = sortSources(filteredSources);
  return sourcesByLanguage(sortedSources);
}

/**
 * @returns Object of languages pointing to arrays of sources.
 * The key `lang` is based on the source.lang ISO 639-1 compliant language code (two letters in lower case).
 */
function sourcesByLanguage(sources: Source[]): { [lang: string]: Source[] } {
  return groupBy(sources, "lang");
}

/**
 * Sorts array of sources by `lang`, then by `name`
 */
export function sortSources(sources: Source[]): Source[] {
  return sortBy(sources, ["lang", "name"]);
}

export function filterEnabledSources(
  sources: Source[],
  hiddenSources: string[],
  enabledLanguages: string[]
): Source[] {
  return filterOutHiddenSources(
    filterSourcesInEnabledLanguages(sources, enabledLanguages),
    hiddenSources
  );
}

function filterOutHiddenSources(
  sources: Source[],
  hiddenSources: string[]
): Source[] {
  return sources.filter(source => !hiddenSources.includes(source.id));
}

function filterSourcesInEnabledLanguages(
  sources: Source[],
  enabledLanguages: string[]
): Source[] {
  return sources.filter(
    source => source.lang != null && enabledLanguages.includes(source.lang)
  );
}
