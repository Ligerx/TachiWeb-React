// @flow
import { connect } from 'react-redux';
import {
  fetchMangaInfo,
  updateMangaInfo,
  FETCH_MANGA,
  UPDATE_MANGA,
  setFlag,
} from 'redux-ducks/mangaInfos';
import {
  fetchChapters,
  updateChapters,
  toggleRead,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS,
} from 'redux-ducks/chapters';
import MangaInfo from 'pages/MangaInfo';
import { createLoadingSelector } from 'redux-ducks/loading';
import type { MangaType, ChapterType } from 'types';

const fetchOrRefreshIsLoading: Function = createLoadingSelector([
  FETCH_MANGA,
  UPDATE_MANGA,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS,
]);

type StateToProps = {
  mangaInfo: ?MangaType,
  chapters: Array<ChapterType>,
  fetchOrRefreshIsLoading: boolean,

  // below props should be passed in by router
  backUrl: string,
  defaultTab: number,
};

const mapStateToProps = (state, ownProps): StateToProps => {
  const { mangaInfos, chapters } = state;
  const { mangaId } = ownProps.match.params;

  return {
    mangaInfo: mangaInfos[mangaId],
    chapters: chapters[mangaId] || [],
    fetchOrRefreshIsLoading: fetchOrRefreshIsLoading(state),

    backUrl: ownProps.backUrl,
    defaultTab: ownProps.defaultTab,
  };
};

type DispatchToProps = {
  fetchChapters: Function,
  fetchMangaInfo: Function,
  updateChapters: Function,
  updateMangaInfo: Function,
  setFlag: Function,
  toggleRead: Function,
};

const mapDispatchToProps = (dispatch, ownProps): DispatchToProps => {
  const mangaId = parseInt(ownProps.match.params.mangaId, 10);

  return {
    fetchChapters: () => dispatch(fetchChapters(mangaId)),
    fetchMangaInfo: (options = {}) => dispatch(fetchMangaInfo(mangaId, options)),
    updateChapters: () => dispatch(updateChapters(mangaId)),
    updateMangaInfo: () => dispatch(updateMangaInfo(mangaId)),
    setFlag: (flag, state) => dispatch(setFlag(mangaId, flag, state)),
    toggleRead: (chapterId, read) => dispatch(toggleRead(mangaId, chapterId, read)),
  };
};

export type MangaInfoContainerProps = StateToProps & DispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(MangaInfo);
