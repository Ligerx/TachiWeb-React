// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { ExtensionType } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import { createSelector } from "reselect";
import {
  FETCH_SUCCESS,
  INSTALL_SUCCESS,
  UNINSTALL_SUCCESS,
  FETCH_EXTENSIONS,
  INSTALL_EXTENSION,
  UNINSTALL_EXTENSION,
  RELOAD_EXTENSIONS
} from "./actions";

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

// ================================================================================
// Selectors
// ================================================================================

export const selectIsExtensionsLoading = createLoadingSelector([
  FETCH_EXTENSIONS,
  INSTALL_EXTENSION,
  UNINSTALL_EXTENSION,
  RELOAD_EXTENSIONS
]);

export const selectExtensions = (
  state: GlobalState
): $ReadOnlyArray<ExtensionType> => state.extensions;

export const selectInstalledExtensions = createSelector(
  [selectExtensions],
  extensions => {
    return extensions
      .filter(extension => extension.status === "INSTALLED")
      .sort(extensionSort);
  }
);

export const selectNotInstalledExtensions = createSelector(
  [selectExtensions],
  extensions => {
    return extensions
      .filter(extension => extension.status !== "INSTALLED")
      .sort(extensionSort);
  }
);

// ================================================================================
// Helper Functions
// ================================================================================

function extensionSort(a: ExtensionType, b: ExtensionType) {
  // First sort alphabetically by language
  // Not using the pretty print / native name, but it gets the job done
  if (a.lang > b.lang) return 1;
  if (a.lang < b.lang) return -1;

  // Then sort alphabetically by source name
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;

  return 0;
}
