import { connect } from 'react-redux';
import { toggleFavorite, updateMangaInfo, TOGGLE_FAVORITE_ACTION } from 'redux-ducks/mangaInfos';
import { fetchLibrary, LIBRARY_LOAD_ACTION } from 'redux-ducks/library';
import { fetchChapters, updateChapters } from 'redux-ducks/chapters';
import MangaInfoPage from 'pages/MangaInfoPage';
import { createLoadingSelector } from 'redux-ducks/loading';

const libraryIsLoading = createLoadingSelector([LIBRARY_LOAD_ACTION]);
const favoriteIsToggling = createLoadingSelector([TOGGLE_FAVORITE_ACTION]);

const mapStateToProps = (state, ownProps) => {
  const { mangaInfos, chapters } = state;
  const { mangaId } = ownProps.match.params;

  return {
    mangaInfo: mangaInfos[mangaId],
    chapters: chapters[mangaId],
    mangaInfoIsLoading: libraryIsLoading(state),
    favoriteIsToggling: favoriteIsToggling(state),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLibrary: () => dispatch(fetchLibrary()),
  fetchChapters: () => dispatch(fetchChapters(ownProps.match.params.mangaId)),
  // Need a nested function to pass in mangaId in the JSX
  toggleFavoriteForManga: (mangaId, isFavorite) => () =>
    dispatch(toggleFavorite(mangaId, isFavorite)),
  updateChapters: mangaId => dispatch(updateChapters(mangaId)),
  updateMangaInfo: mangaId => dispatch(updateMangaInfo(mangaId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MangaInfoPage);
