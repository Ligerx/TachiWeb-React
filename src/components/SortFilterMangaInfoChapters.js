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
  SOURCE: list => list.slice().sort((a, b) => b.source_order - a.source_order),
  NUMBER: list => list.slice().sort((a, b) => a.chapter_number - b.chapter_number),
};

// The manga chapters naturally come in ascending order
const SORT_DIRECTION = {
  DESCENDING: list => list.slice().reverse(),
  ASCENDING: list => list,
};

// READ only shows chapters you've read, UNREAD is the opposite. (a little confusing I know)
const FILTERS = {
  NONE: list => list,
  READ: list =>
    list.slice().filter((chapter) => {
      chapter.read;
    }),
  UNREAD: list =>
    list.slice().filter((chapter) => {
      !chapter.read;
    }),
};

type Props = {
  mangaInfo: MangaType,
  chapters: Array<ChapterType>,
  chapterUrl: Function,
};

const SortFilterMangaInfoChapters = ({ mangaInfo, chapters, chapterUrl }: Props) => {
  // TODO: design the code so that I can chain functions?

  const sortTypeFlag = mangaInfo.flags.SORT_TYPE;
  const sortTypeChapters = SORT_TYPE[sortTypeFlag](chapters);

  const sortDirectionFlag = mangaInfo.flags.SORT_DIRECTION;
  const sortDirectionChapters = SORT_DIRECTION[sortDirectionFlag](sortTypeChapters);

  const sortedFilteredChapters = sortDirectionChapters;

  return (
    <MangaInfoChapters
      mangaInfo={mangaInfo}
      chapters={sortedFilteredChapters}
      chapterUrl={chapterUrl}
    />
  );
};

export default SortFilterMangaInfoChapters;
