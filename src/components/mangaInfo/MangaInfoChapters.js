// @flow
import React from 'react';
import ContinueReadingButton from 'components/mangaInfo/ContinueReadingButton';
import CenterHorizontally from 'components/CenterHorizontally';
import SortFilterChapters from 'components/mangaInfo/SortFilterChapters';
import MangaInfoChapterList from 'components/mangaInfo/MangaInfoChapterList';
import type { MangaType, ChapterType } from 'types';

type Props = {
  chapters: Array<ChapterType>,
  mangaInfo: MangaType,
  toggleRead: Function,
};

const MangaInfoChapters = ({ chapters, mangaInfo, toggleRead }: Props) => (
  <React.Fragment>
    <CenterHorizontally>
      <ContinueReadingButton
        chapters={chapters}
        mangaId={mangaInfo.id}
        style={{ marginBottom: 24 }}
      />
    </CenterHorizontally>

    <SortFilterChapters mangaInfoFlags={mangaInfo.flags} chapters={chapters}>
      {sortedFilteredChapters => (
        <MangaInfoChapterList
          mangaInfo={mangaInfo}
          chapters={sortedFilteredChapters}
          toggleRead={toggleRead}
        />
      )}
    </SortFilterChapters>
  </React.Fragment>
);

export default MangaInfoChapters;
