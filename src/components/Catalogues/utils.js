// @flow
import { useEffect, useState, useRef } from "react";
import type { FilterAnyType } from "types/filters";

export function useSearchQueryFromQueryParam(
  searchQueryParam: ?string
): string {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const newSearchQuery = searchQueryParam
      ? uriToString(searchQueryParam)
      : "";
    setSearchQuery(newSearchQuery);
  }, [searchQueryParam]);

  return searchQuery;
}

export function useFiltersFromQueryParam(
  initialFilters: FilterAnyType[],
  filtersQueryParam: ?string
): FilterAnyType[] {
  const [filters, setFilters] = useState<FilterAnyType[]>([]);

  // Save a copy of initial filters into state when viewing this page with no filters in the search query
  const alreadySavedFiltersRef = useRef(false);
  useEffect(() => {
    if (initialFilters == null) return;
    if (filtersQueryParam != null) return;
    if (alreadySavedFiltersRef.current) return;

    setFilters(initialFilters);
    alreadySavedFiltersRef.current = true;
  }, [initialFilters, filtersQueryParam]);

  useEffect(() => {
    const newFilters = filtersQueryParam
      ? (uriToJSON(filtersQueryParam): FilterAnyType[])
      : [];
    setFilters(newFilters);
  }, [filtersQueryParam]);

  return filters;
}

// URL search query can't support nested objects like filters. So encode it when putting it into the URL and vice versa.
// https://stackoverflow.com/questions/9909620/convert-javascript-object-into-uri-encoded-string
/**
 * Seems to support arrays in addition to objects
 */
export function jsonToURI(json: Object): string {
  return encodeURIComponent(JSON.stringify(json));
}

/**
 * Seems to support arrays in addition to objects
 */
function uriToJSON(urijson: string): Object {
  return JSON.parse(decodeURIComponent(urijson));
}

export function stringToURI(string: string): string {
  return encodeURIComponent(string);
}

function uriToString(uriString: string): string {
  return decodeURIComponent(uriString);
}
