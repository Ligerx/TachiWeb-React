// @flow
import { connect } from "react-redux";
import {
  fetchExtensions,
  installExtension,
  uninstallExtension,
  reloadExtensions,
  FETCH_EXTENSIONS,
  INSTALL_EXTENSION,
  UNINSTALL_EXTENSION,
  RELOAD_EXTENSIONS
} from "redux-ducks/extensions";
import { createLoadingSelector } from "redux-ducks/loading";
import Extensions from "pages/Extensions";
import type { ExtensionType } from "types";

const extensionsIsLoading: Function = createLoadingSelector([
  FETCH_EXTENSIONS,
  INSTALL_EXTENSION,
  UNINSTALL_EXTENSION,
  RELOAD_EXTENSIONS
]);

type StateToProps = {
  extensions: Array<ExtensionType>,
  extensionsIsLoading: boolean
};

const mapStateToProps = (state): StateToProps => ({
  // Extension props
  extensions: state.extensions,
  // Fetching props
  extensionsIsLoading: extensionsIsLoading(state)
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
