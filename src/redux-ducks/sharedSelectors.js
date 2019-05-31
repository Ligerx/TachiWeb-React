// @flow
import { createLoadingSelector } from "redux-ducks/loading";
import { FETCH_MANGA, UPDATE_MANGA } from "redux-ducks/mangaInfos";
import { FETCH_CHAPTERS, UPDATE_CHAPTERS } from "redux-ducks/chapters";

export const selectIsMangaOrChaptersLoading = createLoadingSelector([
  FETCH_MANGA,
  UPDATE_MANGA,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS
]);
