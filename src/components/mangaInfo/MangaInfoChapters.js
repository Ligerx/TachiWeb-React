// @flow
import React from "react";
import ContinueReadingButton from "components/mangaInfo/ContinueReadingButton";
import CenterHorizontally from "components/CenterHorizontally";
import MangaInfoChapterList from "components/mangaInfo/MangaInfoChapterList";
import type { ChapterType } from "types";
import filterSortChapters from "components/mangaInfo/chapterUtils";
import type { Manga } from "@tachiweb/api-client";

type Props = {
  chapters: Array<ChapterType>,
  mangaInfo: Manga,
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
