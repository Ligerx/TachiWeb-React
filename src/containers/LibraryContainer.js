import { connect } from 'react-redux';
import { fetchLibrary, fetchUnread } from 'redux-ducks/library';
import Library from 'pages/Library';

// mangaLibrary - it's possible to have manga stored but not favorited. So filter that out.
//                e.g. unfavoriting something
const mapStateToProps = state => ({
  mangaLibrary: getMangaLibrary(state.mangaInfo, state.library.mangaIds),
  unread: state.library.unread,
});

const mapDispatchToProps = dispatch => ({
  fetchLibrary: options => dispatch(fetchLibrary(options)),
  fetchUnread: () => dispatch(fetchUnread()),
});

// Helper Functions
function getMangaLibrary(mangaInfo, mangaIds) {
  return mangaIds.map(mangaId => mangaInfo[mangaId]);
}

export default connect(mapStateToProps, mapDispatchToProps)(Library);
