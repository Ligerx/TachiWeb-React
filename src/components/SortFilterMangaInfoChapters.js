// @flow
import React, { Component } from 'react';
import type { ChapterType, MangaType } from 'types';
import MangaInfoChapters from './MangaInfoChapters';

// TODO: change this into an HOC? (it's not rendering anything extra)

// TODO: create buttons in the header to let you select sorts and filters
// TODO: link up that header to the MangaInfo state
// TODO: pass down the new state to this component
// TODO: implement the sorting and filtering here

// The manga chapters naturally come in ascending order, so flip them
const SORT_DIRECTION = {
  DESCENDING: list => [...list].reverse(),
  ASCENDING: list => list,
};

// READ only shows chapters you've read, UNREAD is the opposite. (a little confusing I know)
const FILTERS = {
  NONE: list => list,
  READ: list =>
    [...list].filter((chapter) => {
      chapter.read;
    }),
  UNREAD: list =>
    [...list].filter((chapter) => {
      !chapter.read;
    }),
};

type Props = {
  mangaInfo: MangaType,
  chapters: Array<ChapterType>,
  chapterUrl: Function,
};

const SortFilterMangaInfoChapters = ({ mangaInfo, chapters, chapterUrl }: Props) => {
  let sortedChapters;
  if (mangaInfo.flags.SORT_DIRECTION === 'DESCENDING') {
    sortedChapters = SORT_DIRECTION.DESCENDING(chapters);
  } else {
    sortedChapters = SORT_DIRECTION.ASCENDING(chapters);
  }

  return (
    <MangaInfoChapters mangaInfo={mangaInfo} chapters={sortedChapters} chapterUrl={chapterUrl} />
  );
};

export default SortFilterMangaInfoChapters;
