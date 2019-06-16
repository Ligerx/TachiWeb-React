// @flow
import type { ChapterType } from "types";
import type { MangaFlags } from "@tachiweb/api-client";

const sortFuncs = {
  SOURCE: (a, b) => b.source_order - a.source_order,
  NUMBER: (a, b) => a.chapter_number - b.chapter_number
};

// READ shows chapters you've completed, UNREAD shows uncompleted chapters
const readFilterFuncs = {
  SHOW_ALL: () => true,
  SHOW_READ: chapter => chapter.read,
  SHOW_UNREAD: chapter => !chapter.read
};

const downloadedFilterFuncs = {
  SHOW_ALL: () => true,
  SHOW_DOWNLOADED: chapter => chapter.download_status === "DOWNLOADED",
  SHOW_NOT_DOWNLOADED: chapter => chapter.download_status === "NOT_DOWNLOADED" // unused
};

function filterChapters(
  chapters: Array<ChapterType>,
  mangaInfoFlags: MangaFlags
) {
  const { readFilter, downloadedFilter } = mangaInfoFlags;

  return chapters
    .slice() // clone array
    .filter(readFilterFuncs[readFilter])
    .filter(downloadedFilterFuncs[downloadedFilter]);
}

function sortChapters(
  chapters: Array<ChapterType>,
  mangaInfoFlags: MangaFlags
) {
  const { sortType, sortDirection } = mangaInfoFlags;

  let sortedChapters: Array<ChapterType> = chapters
    .slice() // clone array
    .sort(sortFuncs[sortType]);

  // The manga chapters naturally come in ascending order
  if (sortDirection === "DESC") {
    sortedChapters = sortedChapters.reverse();
  }

  return sortedChapters;
}

export default function filterSortChapters(
  chapters: Array<ChapterType>,
  mangaInfoFlags: MangaFlags
) {
  const filteredChapters = filterChapters(chapters, mangaInfoFlags);
  return sortChapters(filteredChapters, mangaInfoFlags);
}
