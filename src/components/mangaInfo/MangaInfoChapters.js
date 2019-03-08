// @flow
import React from "react";
import ContinueReadingButton from "components/mangaInfo/ContinueReadingButton";
import CenterHorizontally from "components/CenterHorizontally";
import MangaInfoChapterList from "components/mangaInfo/MangaInfoChapterList";
import type { MangaType, ChapterType } from "types";
import filterSortChapters from "components/mangaInfo/chapterUtils";

type Props = {
  chapters: Array<ChapterType>,
  mangaInfo: MangaType,
  toggleRead: Function
};

const MangaInfoChapters = ({ chapters, mangaInfo, toggleRead }: Props) => {
  const filteredSortedChapters = filterSortChapters(chapters, mangaInfo.flags);

  return (
    <React.Fragment>
      <CenterHorizontally>
        <ContinueReadingButton
          chapters={chapters}
          mangaId={mangaInfo.id}
          style={{ marginBottom: 24 }}
        />
      </CenterHorizontally>

      <MangaInfoChapterList
        mangaInfo={mangaInfo}
        chapters={filteredSortedChapters}
        toggleRead={toggleRead}
      />
    </React.Fragment>
  );
};

export default MangaInfoChapters;
