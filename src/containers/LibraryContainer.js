import { connect } from 'react-redux';
import { fetchLibrary } from 'redux-ducks/library';
import Library from 'containers/Library';

const mapStateToProps = state => ({
  mangaLibrary: state.library.mangaLibrary,
});

const mapDispatchToProps = dispatch => ({
  fetchLibrary: () => dispatch(fetchLibrary()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
