// @flow
import type { MangaInfoFlagsType, ChapterType } from "types";

const sortFuncs = {
  SOURCE: (a, b) => b.source_order - a.source_order,
  NUMBER: (a, b) => a.chapter_number - b.chapter_number
};

// READ shows chapters you've completed, UNREAD shows uncompleted chapters
const readFilterFuncs = {
  ALL: () => true,
  READ: chapter => chapter.read,
  UNREAD: chapter => !chapter.read
};

const downloadedFilterFuncs = {
  ALL: () => true,
  DOWNLOADED: chapter => chapter.download_status === "DOWNLOADED",
  NOT_DOWNLOADED: chapter => chapter.download_status === "NOT_DOWNLOADED" // unused
};

function filterChapters(
  chapters: Array<ChapterType>,
  mangaInfoFlags: MangaInfoFlagsType
) {
  const { READ_FILTER, DOWNLOADED_FILTER } = mangaInfoFlags;

  return chapters
    .slice() // clone array
    .filter(readFilterFuncs[READ_FILTER])
    .filter(downloadedFilterFuncs[DOWNLOADED_FILTER]);
}

function sortChapters(
  chapters: Array<ChapterType>,
  mangaInfoFlags: MangaInfoFlagsType
) {
  const { SORT_TYPE, SORT_DIRECTION } = mangaInfoFlags;

  let sortedChapters: Array<ChapterType> = chapters
    .slice() // clone array
    .sort(sortFuncs[SORT_TYPE]);

  // The manga chapters naturally come in ascending order
  if (SORT_DIRECTION === "DESCENDING") {
    sortedChapters = sortedChapters.reverse();
  }

  return sortedChapters;
}

export default function filterSortChapters(
  chapters: Array<ChapterType>,
  mangaInfoFlags: MangaInfoFlagsType
) {
  const filteredChapters = filterChapters(chapters, mangaInfoFlags);
  return sortChapters(filteredChapters, mangaInfoFlags);
}
