// @flow
import * as React from 'react';
import type { MangaInfoFlagsType, ChapterType } from 'types';

const sortFuncs = {
  SOURCE: (a, b) => b.source_order - a.source_order,
  NUMBER: (a, b) => a.chapter_number - b.chapter_number,
};

// READ shows chapters you've completed, UNREAD shows uncompleted chapters
const readFilterFuncs = {
  ALL: () => true,
  READ: chapter => chapter.read,
  UNREAD: chapter => !chapter.read,
};

const downloadedFilterFuncs = {
  ALL: () => true,
  DOWNLOADED: chapter => chapter.download_status === 'DOWNLOADED',
  NOT_DOWNLOADED: chapter => chapter.download_status === 'NOT_DOWNLOADED', // unused
};

type Props = {
  mangaInfoFlags: MangaInfoFlagsType,
  chapters: Array<ChapterType>,

  // render props func
  // https://reactjs.org/docs/render-props.html
  children: Function,
};

const SortFilterChapters = ({ mangaInfoFlags, chapters, children }: Props) => {
  const {
    SORT_TYPE, READ_FILTER, DOWNLOADED_FILTER, SORT_DIRECTION,
  } = mangaInfoFlags;

  let sortedFilteredChapters = chapters
    .slice() // clone array
    .sort(sortFuncs[SORT_TYPE])
    .filter(readFilterFuncs[READ_FILTER])
    .filter(downloadedFilterFuncs[DOWNLOADED_FILTER]);

  // The manga chapters naturally come in ascending order
  if (SORT_DIRECTION === 'DESCENDING') {
    sortedFilteredChapters = sortedFilteredChapters.reverse();
  }

  return <React.Fragment>{children(sortedFilteredChapters)}</React.Fragment>;
};

export default SortFilterChapters;
