// @flow
import { connect } from 'react-redux';
import { fetchLibrary, fetchUnread, FETCH_LIBRARY, FETCH_UNREAD } from 'redux-ducks/library';
import Library from 'pages/Library';
import { createLoadingSelector } from 'redux-ducks/loading';

const libraryIsLoading = createLoadingSelector([FETCH_LIBRARY, FETCH_UNREAD]);

const mapStateToProps = state => ({
  mangaLibrary: getMangaLibrary(state.mangaInfos, state.library.mangaIds),
  unread: state.library.unread,
  libraryIsLoading: libraryIsLoading(state),
});

const mapDispatchToProps = dispatch => ({
  fetchLibrary: options => dispatch(fetchLibrary(options)),
  fetchUnread: () => dispatch(fetchUnread()),
});

// Helper Functions
function getMangaLibrary(mangaInfos, mangaIds) {
  return mangaIds.map(mangaId => mangaInfos[mangaId]);
}

export default connect(mapStateToProps, mapDispatchToProps)(Library);
