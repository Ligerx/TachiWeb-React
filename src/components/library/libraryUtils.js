// @flow
import type {
  LibraryFlagsType,
  LibraryFlagsSortType,
  LibraryFlagsFiltersType
} from "types";
import type { Manga } from "@tachiweb/api-client";

// TODO: Consider using a fuzzy search package for the search filter

// NOTE: localeCompare is for string comparison
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
function stringComparison(a: string, b: string) {
  return a.localeCompare(b, "en", { sensitivity: "base" }); // case insensitive
}

// NOTE: sortFuncs.UNREAD and readFilterFuncs require the # of unread chapters for a manga
//       Because I'm keeping unread data separate from the mangaInfo, I need to pass unread
//       to them (even though sortFuncs only needs it for one type).

// If whatever sort comparison is equal, fallback on ordering by title
const sortFuncs = unread => ({
  ALPHA: (a, b) => stringComparison(a.title, b.title),
  UNREAD: (a, b) => {
    if (unread[a.id] !== unread[b.id]) {
      return unread[a.id] - unread[b.id];
    }
    return stringComparison(a.title, b.title);
  },
  LAST_UPDATED: (a, b) => {
    if (a.lastUpdate !== b.lastUpdate) {
      return a.lastUpdate - b.lastUpdate;
    }
    return stringComparison(a.title, b.title);
  }
  /*
  TODO Blocking on fix to v3 library endpoint
  TOTAL: (a, b) => {
    if (a.chapters == null || b.chapters == null) return 0;

    if (a.chapters !== b.chapters) {
      return a.chapters - b.chapters;
    }
    return stringComparison(a.title, b.title);
  },
  TODO Pass in the source name because although we have source id, we must sort
       by source name
  SOURCE: (a, b) => {
    if (a.source !== b.source) {
      return stringComparison(a.source, b.source);
    }
    return stringComparison(a.title, b.title);
  }
  TODO Blocking on fix to v3 library endpoint
  LAST_READ: ,
  */
});

// Not using the EXCLUDE option for these filters
const readFilterFuncs = unread => ({
  ANY: () => true,
  INCLUDE: mangaInfo => unread[mangaInfo.id] // 0 (or null/undefined) will be false
});

/* TODO Blocking on fix to v3 endpoint
const downloadedFilterFuncs = {
  ANY: () => true,
  INCLUDE: mangaInfo => mangaInfo.downloaded
}; */

const completedFilterFuncs = {
  ANY: () => true,

  INCLUDE: mangaInfo => mangaInfo.status === "COMPLETED"
};

const searchFilterFunc = searchQuery => mangaInfo =>
  mangaInfo.title.toUpperCase().includes(searchQuery.toUpperCase());

function sortLibrary(
  mangaLibrary: Array<Manga>,
  sortFlags: LibraryFlagsSortType,
  unread: { [mangaId: number]: number }
) {
  const { type, direction } = sortFlags;
  let sortedLibrary: Array<Manga> = mangaLibrary
    .slice() // clone array
    .sort(sortFuncs(unread)[type]);

  if (direction === "DESCENDING") {
    sortedLibrary = sortedLibrary.reverse();
  }

  return sortedLibrary;
}

function filterLibrary(
  mangaLibrary: Array<Manga>,
  filterFlags: LibraryFlagsFiltersType,
  unread: { [mangaId: number]: number },
  searchQuery: string
) {
  const [unreadFilter, completedFilter] = filterFlags;
  return mangaLibrary
    .slice() // clone array
    .filter(readFilterFuncs(unread)[unreadFilter.status])
    // TODO Blocking on fix to v3 endpoint
    // .filter(downloadedFilterFuncs[downloadedFilter.status])
    .filter(completedFilterFuncs[completedFilter.status])
    .filter(searchFilterFunc(searchQuery));
}

export default function filterSortLibrary(
  mangaLibrary: Array<Manga>,
  libraryFlags: LibraryFlagsType,
  unread: { [mangaId: number]: number },
  searchQuery: string
) {
  const filteredLibrary = filterLibrary(
    mangaLibrary,
    libraryFlags.filters,
    unread,
    searchQuery
  );
  return sortLibrary(filteredLibrary, libraryFlags.sort, unread);
}
