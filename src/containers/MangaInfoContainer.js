import { connect } from 'react-redux';
import {
  toggleFavorite,
  fetchMangaInfo,
  updateMangaInfo,
  TOGGLE_FAVORITE,
  FETCH_MANGA,
  UPDATE_MANGA,
} from 'redux-ducks/mangaInfos';
import {
  fetchChapters,
  updateChapters,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS,
} from 'redux-ducks/chapters';
import MangaInfoPage from 'pages/MangaInfoPage';
import { createLoadingSelector } from 'redux-ducks/loading';

const mangaInfoIsLoading = createLoadingSelector([FETCH_MANGA]);
const favoriteIsToggling = createLoadingSelector([TOGGLE_FAVORITE]);
const refreshIsLoading = createLoadingSelector([
  FETCH_MANGA,
  UPDATE_MANGA,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS,
]);

const mapStateToProps = (state, ownProps) => {
  const { mangaInfos, chapters } = state;
  const { mangaId } = ownProps.match.params;

  return {
    mangaInfo: mangaInfos[mangaId],
    chapters: chapters[mangaId],
    mangaInfoIsLoading: mangaInfoIsLoading(state),
    favoriteIsToggling: favoriteIsToggling(state),
    refreshIsLoading: refreshIsLoading(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const mangaId = parseInt(ownProps.match.params.mangaId, 10);

  return {
    fetchChapters: () => dispatch(fetchChapters(mangaId)),
    fetchMangaInfo: () => dispatch(fetchMangaInfo(mangaId)),
    updateChapters: () => dispatch(updateChapters(mangaId)),
    updateMangaInfo: () => dispatch(updateMangaInfo(mangaId)),
    // Need a nested function to pass in mangaId in the JSX
    toggleFavorite: isFavorite => () => dispatch(toggleFavorite(mangaId, isFavorite)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MangaInfoPage);
