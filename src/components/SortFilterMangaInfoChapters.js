// @flow
import React, { Component } from 'react';
import type { ChapterType, MangaType } from 'types';
import MangaInfoChapters from './MangaInfoChapters';

// TODO: create buttons in the header to let you select sorts and filters
// TODO: link up that header to the MangaInfo state
// TODO: pass down the new state to this component
// TODO: implement the sorting and filtering here

// The manga chapters naturally come in 'reverse' order, so flip them
const SORTS = {
  DEFAULT: list => [...list].reverse(),
  REVERSE: list => list,
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
  mangaInfo?: MangaType,
  chapters: Array<ChapterType>,
};

const SortFilterMangaInfoChapters = ({ mangaInfo, chapters }: Props) => {
  const sortedChapters = SORTS.DEFAULT(chapters);

  return <MangaInfoChapters mangaInfo={mangaInfo} chapters={sortedChapters} />;
};

SortFilterMangaInfoChapters.defaultProps = {
  mangaInfo: null,
};

export default SortFilterMangaInfoChapters;
