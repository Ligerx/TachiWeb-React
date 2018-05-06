import { connect } from 'react-redux';
import { fetchLibrary } from 'redux-ducks/library';
import { fetchChapters } from 'redux-ducks/chapters';
import MangaInfo from 'containers/MangaInfo';

// search the manga library for the manga that matches the url param

// https://stackoverflow.com/questions/44725802/within-mapstatetoprops-how-to-obtain-a-react-router-param?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

// FIXME: before library is fetched, can't find this manga, so can't display text
//        the correct solution would be to do a do a loading spinner state instead of rendering
const getThisManga = (mangaLibrary, mangaId) => {
  console.log('test');
  return mangaLibrary.find(manga => manga.id === parseInt(mangaId, 10)) || {};
};

const mapStateToProps = (state, ownProps) => ({
  mangaInfo: getThisManga(state.library.mangaLibrary, ownProps.match.params.mangaId),
  chapters: state.chapters.chapters,
  mangaInfoIsFetching: state.library.isFetching,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchLibrary: () => dispatch(fetchLibrary()),
  fetchChapters: () => dispatch(fetchChapters(ownProps.match.params.mangaId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MangaInfo);
