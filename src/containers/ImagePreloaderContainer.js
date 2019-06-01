// @flow
import { connect } from "react-redux";
import ImagePreloader from "components/reader/ImagePreloader";
import { withRouter } from "react-router-dom";
import { selectPageCount } from "redux-ducks/pageCounts";
import { selectNextChapterId } from "redux-ducks/chapters";

type StateToProps = {
  mangaId: number,
  chapterId: number,
  page: number,
  pageCount: number,
  nextChapterId: ?number
};

const mapStateToProps = (state, ownProps): StateToProps => {
  const mangaId = parseInt(ownProps.match.params.mangaId, 10);
  const chapterId = parseInt(ownProps.match.params.chapterId, 10);
  const page = parseInt(ownProps.match.params.page, 10);

  return {
    mangaId,
    chapterId,
    page,
    pageCount: selectPageCount(state, chapterId) || 0, // FIXME: inefficient redux design?
    nextChapterId: selectNextChapterId(state, mangaId, chapterId)
  };
};

export type ImagePreloaderContainerProps = StateToProps;
export default withRouter(connect(mapStateToProps)(ImagePreloader));
