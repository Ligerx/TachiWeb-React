// @flow
import { connect } from "react-redux";
import {
  fetchLibrary,
  fetchUnread,
  fetchLibraryFlags,
  setLibraryFlag,
  FETCH_LIBRARY,
  FETCH_UNREAD,
  FETCH_LIBRARY_FLAGS
} from "redux-ducks/library";
import Library from "pages/Library";
import { createLoadingSelector } from "redux-ducks/loading";
import type { LibraryFlagsType } from "types";
import {
  updateChapters,
  UPDATE_CHAPTERS,
  FETCH_CHAPTERS
} from "redux-ducks/chapters";
import type { Manga } from "@tachiweb/api-client";

const libraryIsLoading = createLoadingSelector([
  FETCH_LIBRARY,
  FETCH_UNREAD,
  FETCH_LIBRARY_FLAGS
]);
const chaptersAreUpdating = createLoadingSelector([
  UPDATE_CHAPTERS,
  FETCH_CHAPTERS
]);

type StateToProps = {
  mangaLibrary: Array<Manga>,
  unread: { [mangaId: number]: number },
  libraryIsLoading: boolean,
  chaptersAreUpdating: boolean,
  flags: LibraryFlagsType
};

const mapStateToProps = state =>
  ({
    mangaLibrary: getMangaLibrary(state.mangaInfos, state.library.mangaIds),
    unread: state.library.unread,
    flags: state.library.flags,
    libraryIsLoading: libraryIsLoading(state),
    chaptersAreUpdating: chaptersAreUpdating(state)
  }: StateToProps);

type DispatchToProps = {
  fetchLibrary: Function,
  fetchUnread: Function,
  updateChapters: Function,
  fetchLibraryFlags: Function,
  setLibraryFlag: Function
};

const mapDispatchToProps = (dispatch): DispatchToProps => ({
  fetchLibrary: options => dispatch(fetchLibrary(options)),
  fetchUnread: options => dispatch(fetchUnread(options)),
  updateChapters: mangaId => dispatch(updateChapters(mangaId)),
  fetchLibraryFlags: () => dispatch(fetchLibraryFlags()),
  setLibraryFlag: (flag, state) => dispatch(setLibraryFlag(flag, state))
});

// Helper Functions
function getMangaLibrary(mangaInfos, mangaIds): Array<Manga> {
  return mangaIds.map(mangaId => mangaInfos[mangaId]);
}

export type LibraryContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
