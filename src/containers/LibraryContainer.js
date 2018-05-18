import { connect } from 'react-redux';
import { fetchLibrary, fetchUnread } from 'redux-ducks/library';
import Library from 'pages/Library';

// mangaLibrary - it's possible to have manga stored but not favorited. So filter that out.
//                e.g. unfavoriting something
const mapStateToProps = state => ({
  mangaLibrary: state.library.mangaLibrary.filter(manga => manga.favorite),
  unread: state.library.unread,
});

const mapDispatchToProps = dispatch => ({
  fetchLibrary: options => dispatch(fetchLibrary(options)),
  fetchUnread: () => dispatch(fetchUnread()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Library);
