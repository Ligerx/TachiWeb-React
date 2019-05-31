// @flow
import { connect } from "react-redux";
import RestoreCard from "components/backup-restore/RestoreCard";
import {
  selectIsRestoreLoading,
  selectDidRestoreFail,
  uploadRestoreFile
} from "redux-ducks/library";

type StateToProps = {
  isRestoreLoading: boolean,
  didRestoreFail: boolean
};

const mapStateToProps = (state): StateToProps => ({
  isRestoreLoading: selectIsRestoreLoading(state),
  didRestoreFail: selectDidRestoreFail(state)
});

type DispatchToProps = { uploadRestoreFile: Function };

const mapDispatchToProps = (dispatch): DispatchToProps => ({
  uploadRestoreFile: file => dispatch(uploadRestoreFile(file))
});

export type RestoreCardContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestoreCard);
