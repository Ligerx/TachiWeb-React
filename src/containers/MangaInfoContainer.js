import { connect } from 'react-redux';
import { fetchLibrary, toggleFavorite } from 'redux-ducks/library';
import { fetchChapters } from 'redux-ducks/chapters';
import MangaInfoPage from 'pages/MangaInfoPage';

const getThisManga = (mangaLibrary, mangaId) =>
  mangaLibrary.find(manga => manga.id === parseInt(mangaId, 10));

const mapStateToProps = (state, ownProps) => {
  const { library } = state;
  const { chaptersByMangaId } = state.chapters;
  const { mangaId } = ownProps.match.params;

  return {
    mangaInfo: getThisManga(library.mangaLibrary, mangaId),
    chapters: chaptersByMangaId[mangaId],
    mangaInfoIsFetching: library.isFetching,
    isTogglingFavorite: library.isTogglingFavorite,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLibrary: () => dispatch(fetchLibrary()),
  fetchChapters: () => dispatch(fetchChapters(ownProps.match.params.mangaId)),
  // Need a nested function to pass in mangaId in the JSX
  toggleFavoriteForManga: (mangaId, isFavorite) => () =>
    dispatch(toggleFavorite(mangaId, isFavorite)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MangaInfoPage);
