import { connect } from 'react-redux';
import Library from 'containers/Library';
import { fetchLibrary } from 'redux-ducks/library';

const mapStateToProps = state => ({
  mangaLibrary: state.library.manga,
});

const mapDispatchToProps = dispatch => ({
  fetchLibrary: () => dispatch(fetchLibrary()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
