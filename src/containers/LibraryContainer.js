import { connect } from 'react-redux';
import { fetchLibrary } from 'redux-ducks/library';
import Library from 'containers/Library';

// mangaLibrary - it's possible to have manga stored but not favorited. So filter that out.
//                e.g. unfavoriting something
const mapStateToProps = state => ({
  mangaLibrary: state.library.mangaLibrary.filter(manga => manga.favorite),
});

const mapDispatchToProps = dispatch => ({
  fetchLibrary: () => dispatch(fetchLibrary()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
