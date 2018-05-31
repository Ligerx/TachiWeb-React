// @flow
import React, { Component } from 'react';
import type { ChapterType, MangaType } from 'types';
import MangaInfoChapters from './MangaInfoChapters';

// TODO: change this into an HOC? (it's not rendering anything extra)

// TODO: create buttons in the header to let you select sorts and filters
// TODO: link up that header to the MangaInfo state
// TODO: pass down the new state to this component
// TODO: implement the sorting and filtering here

const SORT_TYPE = {
  SOURCE: (a, b) => b.source_order - a.source_order,
  NUMBER: (a, b) => a.chapter_number - b.chapter_number,
};

// READ shows chapters you've completed, UNREAD shows uncompleted chapters
const READ_FILTER = {
  ALL: () => true,
  READ: chapter => chapter.read,
  UNREAD: chapter => !chapter.read,
};

const DOWNLOADED_FILTER = {
  ALL: () => true,
  DOWNLOADED: chapter => chapter.download_status === 'DOWNLOADED',
  NOT_DOWNLOADED: chapter => chapter.download_status === 'NOT_DOWNLOADED', // unused
};

type Props = {
  mangaInfo: MangaType,
  chapters: Array<ChapterType>,
  chapterUrl: Function,
};

const SortFilterMangaInfoChapters = ({ mangaInfo, chapters, chapterUrl }: Props) => {
  const sortTypeFlag = mangaInfo.flags.SORT_TYPE;
  const sortTypeFunc = SORT_TYPE[sortTypeFlag];

  const readFilterFlag = mangaInfo.flags.READ_FILTER;
  const readFilterFunc = READ_FILTER[readFilterFlag];

  const downloadedFilterFlag = mangaInfo.flags.DOWNLOADED_FILTER;
  const downloadedFilterFunc = DOWNLOADED_FILTER[downloadedFilterFlag];

  const sortDirectionFlag = mangaInfo.flags.SORT_DIRECTION;

  let sortedFilteredChapters = chapters
    .slice() // clone array
    .sort(sortTypeFunc)
    .filter(readFilterFunc)
    .filter(downloadedFilterFunc);

  // The manga chapters naturally come in ascending order
  if (sortDirectionFlag === 'DESCENDING') {
    sortedFilteredChapters = sortedFilteredChapters.reverse();
  }

  return (
    <MangaInfoChapters
      mangaInfo={mangaInfo}
      chapters={sortedFilteredChapters}
      chapterUrl={chapterUrl}
    />
  );
};

export default SortFilterMangaInfoChapters;
