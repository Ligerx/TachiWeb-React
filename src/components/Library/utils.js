// @flow
import type {
  LibraryFlagsType,
  LibraryFlagsSortType,
  LibraryFlagsFiltersType,
  SourceMap
} from "types";
import type { LibraryManga } from "@tachiweb/api-client";

// TODO: Consider using a fuzzy search package for the search filter

// NOTE: localeCompare is for string comparison
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
function stringComparison(a: string, b: string) {
  return a.localeCompare(b, "en", { sensitivity: "base" }); // case insensitive
}

const downloadedFilterFuncs = {
  ANY: () => true,
  INCLUDE: (libraryManga: LibraryManga) =>
    libraryManga.totalDownloaded != null && libraryManga.totalDownloaded > 0
};

// Not using the EXCLUDE option for these filters
const readFilterFuncs = {
  ANY: () => true,
  INCLUDE: (libraryManga: LibraryManga) =>
    libraryManga.totalUnread != null && libraryManga.totalUnread > 0
};

const completedFilterFuncs = {
  ANY: () => true,
  INCLUDE: (libraryManga: LibraryManga) =>
    libraryManga.manga.status === "COMPLETED"
};

const searchFilterFunc = (searchQuery: string) => (
  libraryManga: LibraryManga
) => libraryManga.manga.title.toUpperCase().includes(searchQuery.toUpperCase());

function filterLibrary(
  libraryMangas: LibraryManga[],
  filterFlags: LibraryFlagsFiltersType,
  searchQuery: string
): LibraryManga[] {
  const [DOWNLOADED, UNREAD, COMPLETED] = filterFlags;

  return libraryMangas
    .slice() // clone array
    .filter(downloadedFilterFuncs[DOWNLOADED.status])
    .filter(readFilterFuncs[UNREAD.status])
    .filter(completedFilterFuncs[COMPLETED.status])
    .filter(searchFilterFunc(searchQuery));
}

// If whatever sort comparison is equal, fallback on ordering by title
const sortFuncs = (totalMangaCount, sources) => ({
  ALPHA: (a, b) => stringComparison(a.manga.title, b.manga.title),
  LAST_READ: (a, b) => {
    // lastReadIndex is an index, not an actual count, but it still works
    let aIndex = a.lastReadIndex;
    let bIndex = b.lastReadIndex;

    // Push manga that were never read to the back
    if (aIndex == null) aIndex = totalMangaCount;
    if (bIndex == null) bIndex = totalMangaCount;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return stringComparison(a.manga.title, b.manga.title);
  },
  LAST_UPDATED: (a, b) => {
    if (a.manga.lastUpdate !== b.manga.lastUpdate) {
      return a.manga.lastUpdate - b.manga.lastUpdate;
    }
    return stringComparison(a.manga.title, b.manga.title);
  },
  UNREAD: (a, b) => {
    if (a.totalUnread !== b.totalUnread) {
      return a.totalUnread - b.totalUnread;
    }
    return stringComparison(a.manga.title, b.manga.title);
  },
  TOTAL: (a, b) => {
    // totalChaptersIndex is an index, not an actual count, but it still works
    let aIndex = a.totalChaptersIndex;
    let bIndex = b.totalChaptersIndex;

    // Push manga that have 0 or unknown chapters to the front
    if (aIndex == null) aIndex = 0;
    if (bIndex == null) bIndex = 0;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return stringComparison(a.manga.title, b.manga.title);
  },
  SOURCE: (a, b) => {
    // Use source ID as source title if the source is not loaded
    const aSource = sources[a.manga.sourceId] || { name: a.manga.sourceId };
    const bSource = sources[b.manga.sourceId] || { name: b.manga.sourceId };

    if (aSource !== bSource) {
      return stringComparison(aSource.name, bSource.name);
    }
    return stringComparison(a.manga.title, b.manga.title);
  }
});

function sortLibrary(
  libraryMangas: LibraryManga[],
  sortFlags: LibraryFlagsSortType,
  sources: SourceMap
): LibraryManga[] {
  const { type, direction } = sortFlags;
  let sortedLibraryMangas: LibraryManga[] = libraryMangas
    .slice() // clone array
    .sort(sortFuncs(libraryMangas.length, sources)[type]);

  if (direction === "DESCENDING") {
    sortedLibraryMangas = sortedLibraryMangas.reverse();
  }

  return sortedLibraryMangas;
}

// eslint-disable-next-line import/prefer-default-export
export function filterSortLibrary(
  libraryMangas: LibraryManga[],
  libraryFlags: LibraryFlagsType,
  sources: SourceMap,
  searchQuery: string
): LibraryManga[] {
  const filteredLibraryMangas = filterLibrary(
    libraryMangas,
    libraryFlags.filters,
    searchQuery
  );

  return sortLibrary(filteredLibraryMangas, libraryFlags.sort, sources);
}
