// @flow
import { connect } from 'react-redux';
import { fetchLibrary, fetchUnread, FETCH_LIBRARY, FETCH_UNREAD } from 'redux-ducks/library';
import Library from 'pages/Library';
import { createLoadingSelector } from 'redux-ducks/loading';
import type { MangaType } from 'types';

const libraryIsLoading = createLoadingSelector([FETCH_LIBRARY, FETCH_UNREAD]);

type StateToProps = {
  mangaLibrary: Array<MangaType>,
  unread: { [mangaId: number]: number },
  libraryIsLoading: boolean,
};

const mapStateToProps = state =>
  ({
    mangaLibrary: getMangaLibrary(state.mangaInfos, state.library.mangaIds),
    unread: state.library.unread,
    libraryIsLoading: libraryIsLoading(state),
  }: StateToProps);

type DispatchToProps = {
  fetchLibrary: Function,
  fetchUnread: Function,
};

const mapDispatchToProps = (dispatch): DispatchToProps => ({
  fetchLibrary: options => dispatch(fetchLibrary(options)),
  fetchUnread: () => dispatch(fetchUnread()),
});

// Helper Functions
function getMangaLibrary(mangaInfos, mangaIds): Array<MangaType> {
  return mangaIds.map(mangaId => mangaInfos[mangaId]);
}

export type LibraryContainerProps = StateToProps & DispatchToProps;
export default connect(mapStateToProps, mapDispatchToProps)(Library);
