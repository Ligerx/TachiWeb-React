// @flow
import type {
  LibraryFlagsType,
  LibraryFlagsSortType,
  LibraryFlagsFiltersType,
  SourceMap
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
const sortFuncs = (
  totalMangaCount,
  sources,
  unread,
  totalChaptersSortIndexes,
  lastReadSortIndexes
) => ({
  ALPHA: (a, b) => stringComparison(a.title, b.title),
  LAST_READ: (a, b) => {
    let aIndex = lastReadSortIndexes[a.id];
    let bIndex = lastReadSortIndexes[b.id];
    // Push manga that were never read to the back
    if (aIndex == null) aIndex = totalMangaCount;
    if (bIndex == null) bIndex = totalMangaCount;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return stringComparison(a.title, b.title);
  },
  LAST_UPDATED: (a, b) => {
    if (a.lastUpdate !== b.lastUpdate) {
      return a.lastUpdate - b.lastUpdate;
    }
    return stringComparison(a.title, b.title);
  },
  UNREAD: (a, b) => {
    if (unread[a.id] !== unread[b.id]) {
      return unread[a.id] - unread[b.id];
    }
    return stringComparison(a.title, b.title);
  },
  TOTAL: (a, b) => {
    let aIndex = totalChaptersSortIndexes[a.id];
    let bIndex = totalChaptersSortIndexes[b.id];
    // Push manga that have 0 or unknown chapters to the front
    if (aIndex == null) aIndex = 0;
    if (bIndex == null) bIndex = 0;

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return stringComparison(a.title, b.title);
  },
  SOURCE: (a, b) => {
    // Use source ID as source title if the source is not loaded
    const aSource = sources[a.sourceId] || { name: a.sourceId };
    const bSource = sources[b.sourceId] || { name: b.sourceId };

    if (aSource !== bSource) {
      return stringComparison(aSource.name, bSource.name);
    }
    return stringComparison(a.title, b.title);
  }
});

// Not using the EXCLUDE option for these filters
const readFilterFuncs = unread => ({
  ANY: () => true,
  INCLUDE: mangaInfo => unread[mangaInfo.id] // 0 (or null/undefined) will be false
});

const downloadedFilterFuncs = downloaded => ({
  ANY: () => true,
  INCLUDE: mangaInfo => downloaded[mangaInfo.id]
});

const completedFilterFuncs = {
  ANY: () => true,

  INCLUDE: mangaInfo => mangaInfo.status === "COMPLETED"
};

const searchFilterFunc = searchQuery => mangaInfo =>
  mangaInfo.title.toUpperCase().includes(searchQuery.toUpperCase());

function sortLibrary(
  mangaLibrary: Array<Manga>,
  sortFlags: LibraryFlagsSortType,
  sources: SourceMap,
  unread: { [mangaId: number]: number },
  totalChaptersSortIndexes: { [mangaId: number]: number },
  lastReadSortIndexes: { [mangaId: number]: number }
) {
  const { type, direction } = sortFlags;
  let sortedLibrary: Array<Manga> = mangaLibrary
    .slice() // clone array
    .sort(
      sortFuncs(
        mangaLibrary.length,
        sources,
        unread,
        totalChaptersSortIndexes,
        lastReadSortIndexes
      )[type]
    );

  if (direction === "DESCENDING") {
    sortedLibrary = sortedLibrary.reverse();
  }

  return sortedLibrary;
}

function filterLibrary(
  mangaLibrary: Array<Manga>,
  filterFlags: LibraryFlagsFiltersType,
  unread: { [mangaId: number]: number },
  downloaded: { [mangaId: number]: number },
  searchQuery: string
) {
  const [DOWNLOADED, UNREAD, COMPLETED] = filterFlags;
  return mangaLibrary
    .slice() // clone array
    .filter(downloadedFilterFuncs(downloaded)[DOWNLOADED.status])
    .filter(readFilterFuncs(unread)[UNREAD.status])
    .filter(completedFilterFuncs[COMPLETED.status])
    .filter(searchFilterFunc(searchQuery));
}

export default function filterSortLibrary(
  mangaLibrary: Array<Manga>,
  libraryFlags: LibraryFlagsType,
  sources: SourceMap,
  unread: { [mangaId: number]: number },
  downloaded: { [mangaId: number]: number },
  totalChaptersSortIndexes: { [mangaId: number]: number },
  lastReadSortIndexes: { [mangaId: number]: number },
  searchQuery: string
) {
  const filteredLibrary = filterLibrary(
    mangaLibrary,
    libraryFlags.filters,
    unread,
    downloaded,
    searchQuery
  );
  return sortLibrary(
    filteredLibrary,
    libraryFlags.sort,
    sources,
    unread,
    totalChaptersSortIndexes,
    lastReadSortIndexes
  );
}
