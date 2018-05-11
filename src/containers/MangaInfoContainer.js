import { connect } from 'react-redux';
import { fetchLibrary } from 'redux-ducks/library';
import { fetchChapters } from 'redux-ducks/chapters';
import MangaInfoPage from 'pages/MangaInfoPage';

const getThisManga = (mangaLibrary, mangaId) =>
  mangaLibrary.find(manga => manga.id === parseInt(mangaId, 10));

const mapStateToProps = (state, ownProps) => {
  const { library } = state;
  const { chapters } = state.chapters;
  const { mangaId } = ownProps.match.params;

  return {
    mangaInfo: getThisManga(library.mangaLibrary, mangaId),
    chapters: chapters[mangaId],
    mangaInfoIsFetching: library.isFetching,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLibrary: () => dispatch(fetchLibrary()),
  fetchChapters: () => dispatch(fetchChapters(ownProps.match.params.mangaId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MangaInfoPage);
