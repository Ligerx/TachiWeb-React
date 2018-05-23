// @flow
import { connect } from 'react-redux';
import { fetchMangaInfo, updateMangaInfo, FETCH_MANGA, UPDATE_MANGA } from 'redux-ducks/mangaInfos';
import {
  fetchChapters,
  updateChapters,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS,
} from 'redux-ducks/chapters';
import MangaInfoPage from 'pages/MangaInfoPage';
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
};

const mapStateToProps = (state, ownProps): StateToProps => {
  const { mangaInfos, chapters } = state;
  const { mangaId } = ownProps.match.params;

  return {
    mangaInfo: mangaInfos[mangaId],
    chapters: chapters[mangaId] || [],
    fetchOrRefreshIsLoading: fetchOrRefreshIsLoading(state),
  };
};

type DispatchToProps = {
  fetchChapters: Function,
  fetchMangaInfo: Function,
  updateChapters: Function,
  updateMangaInfo: Function,
};

const mapDispatchToProps = (dispatch, ownProps): DispatchToProps => {
  const mangaId = parseInt(ownProps.match.params.mangaId, 10);

  return {
    fetchChapters: () => dispatch(fetchChapters(mangaId)),
    fetchMangaInfo: () => dispatch(fetchMangaInfo(mangaId)),
    updateChapters: () => dispatch(updateChapters(mangaId)),
    updateMangaInfo: () => dispatch(updateMangaInfo(mangaId)),
  };
};

export type MangaInfoContainerProps = StateToProps & DispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(MangaInfoPage);
