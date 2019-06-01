// @flow
import { connect } from "react-redux";
import {
  selectIsLibraryLoading,
  selectUnread,
  selectLibraryFlags,
  selectLibraryMangaInfos,
  fetchLibrary,
  fetchUnread,
  fetchLibraryFlags,
  setLibraryFlag
} from "redux-ducks/library";
import Library from "pages/Library";
import type { MangaType, LibraryFlagsType } from "types";
import { selectIsChaptersLoading, updateChapters } from "redux-ducks/chapters";

type StateToProps = {
  mangaLibrary: Array<MangaType>,
  unread: { +[mangaId: number]: number },
  libraryIsLoading: boolean,
  chaptersAreUpdating: boolean,
  flags: LibraryFlagsType
};

const mapStateToProps = state =>
  ({
    mangaLibrary: selectLibraryMangaInfos(state),
    unread: selectUnread(state),
    flags: selectLibraryFlags(state),
    libraryIsLoading: selectIsLibraryLoading(state),
    chaptersAreUpdating: selectIsChaptersLoading(state)
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

export type LibraryContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
