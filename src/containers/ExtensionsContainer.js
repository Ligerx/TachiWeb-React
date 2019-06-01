// @flow
import { connect } from "react-redux";
import {
  selectIsExtensionsLoading,
  selectExtensions,
  fetchExtensions,
  installExtension,
  uninstallExtension,
  reloadExtensions
} from "redux-ducks/extensions";
import Extensions from "pages/Extensions";
import type { ExtensionType } from "types";

type StateToProps = {
  extensions: Array<ExtensionType>,
  isExtensionsLoading: boolean
};

const mapStateToProps = (state): StateToProps => ({
  extensions: selectExtensions(state),
  isExtensionsLoading: selectIsExtensionsLoading(state)
});

type DispatchToProps = {
  fetchExtensions: Function,
  installExtension: Function,
  uninstallExtension: Function,
  reloadExtensions: Function
};

const mapDispatchToProps = (dispatch): DispatchToProps => ({
  fetchExtensions: () => dispatch(fetchExtensions()),
  installExtension: packageName => dispatch(installExtension(packageName)),
  uninstallExtension: packageName => dispatch(uninstallExtension(packageName)),
  reloadExtensions: () => dispatch(reloadExtensions())
});

export type ExtensionsContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Extensions);
