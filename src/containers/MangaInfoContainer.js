// @flow
import { connect } from "react-redux";
import {
  selectIsMangaInfosLoading,
  selectMangaInfo,
  fetchMangaInfo,
  updateMangaInfo,
  setFlag
} from "redux-ducks/mangaInfos";
import {
  selectIsChaptersLoading,
  selectChaptersForManga,
  fetchChapters,
  updateChapters,
  toggleRead
} from "redux-ducks/chapters";
import MangaInfo from "pages/MangaInfo";
import type { MangaType, ChapterType } from "types";

type StateToProps = {
  mangaInfo: ?MangaType,
  chapters: Array<ChapterType>,
  isMangaInfosLoading: boolean,
  isChaptersLoading: boolean,

  // below props should be passed in by router
  backUrl: string,
  defaultTab: number
};

const mapStateToProps = (state, ownProps): StateToProps => {
  const { mangaId } = ownProps.match.params;

  return {
    mangaInfo: selectMangaInfo(state, mangaId),
    chapters: selectChaptersForManga(state, mangaId),
    isMangaInfosLoading: selectIsMangaInfosLoading(state),
    isChaptersLoading: selectIsChaptersLoading(state),

    backUrl: ownProps.backUrl,
    defaultTab: ownProps.defaultTab
  };
};

type DispatchToProps = {
  fetchChapters: Function,
  fetchMangaInfo: Function,
  updateChapters: Function,
  updateMangaInfo: Function,
  setFlag: Function,
  toggleRead: Function
};

const mapDispatchToProps = (dispatch, ownProps): DispatchToProps => {
  const mangaId = parseInt(ownProps.match.params.mangaId, 10);

  return {
    fetchChapters: () => dispatch(fetchChapters(mangaId)),
    fetchMangaInfo: (options = {}) =>
      dispatch(fetchMangaInfo(mangaId, options)),
    updateChapters: () => dispatch(updateChapters(mangaId)),
    updateMangaInfo: () => dispatch(updateMangaInfo(mangaId)),
    setFlag: (flag, state) => dispatch(setFlag(mangaId, flag, state)),
    toggleRead: (chapterId, read) =>
      dispatch(toggleRead(mangaId, chapterId, read))
  };
};

export type MangaInfoContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MangaInfo);
