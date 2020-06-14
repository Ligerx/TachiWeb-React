// @flow
import type { Action } from "redux-ducks/reducers";
import type { ExtensionType } from "types";
import { FETCH_SUCCESS, INSTALL_SUCCESS, UNINSTALL_SUCCESS } from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnlyArray<ExtensionType>;

export default function extensionsReducer(
  state: State = [],
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.extensions;

    case INSTALL_SUCCESS: {
      const updatedExtension: ExtensionType = action.extension;

      return (state.map(extension => {
        // Replace the non-installed extension data with updated extension
        if (updatedExtension.pkg_name === extension.pkg_name) {
          return updatedExtension;
        }
        return extension;
      }): State);
    }

    case UNINSTALL_SUCCESS:
      return (state.map(extension => {
        if (action.packageName === extension.pkg_name) {
          return { ...extension, status: "AVAILABLE" };
        }
        return extension;
      }): State);

    default:
      return state;
  }
}
