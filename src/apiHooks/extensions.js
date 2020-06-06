// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { ExtensionType } from "types";
import { fetcherUnpackData } from "./utils";

export function useExtensions() {
  const dispatch = useDispatch();

  return useSWR<ExtensionType[]>(Server.extensions(), fetcherUnpackData, {
    onError(error) {
      dispatch({
        type: "extensions/FETCH_FAILURE",
        errorMessage: "Failed to load extensions.",
        meta: { error }
      });
    }
  });
}

// TODO do i need to expose some sort of isLoading capability?
export function useReloadExtensions(): () => Promise<void> {
  const dispatch = useDispatch();

  return async () => {
    try {
      const response = await fetch(Server.reloadExtensions(), {
        method: "POST"
      });

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      mutate(Server.extensions());

      // TODO: are these manual mutations actually needed?
      // dispatch({ type: RESET_SOURCES });
      // dispatch(resetCataloguesAndFilters());
    } catch (error) {
      dispatch({
        type: "extensions/RELOAD_FAILURE",
        errorMessage: "Failed to reload extensions.",
        meta: { error }
      });
    }
  };
}

// TODO do i need to expose some sort of isLoading capability?
export function useUninstallExtension(): (
  extension: ExtensionType
) => Promise<void> {
  const dispatch = useDispatch();

  return async extension => {
    try {
      const { pkg_name: packageName } = extension;

      const response = await fetch(Server.extension(packageName), {
        method: "DELETE"
      });

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      mutate(Server.extensions());

      // TODO: are these manual mutations actually needed?
      // dispatch({ type: RESET_SOURCES });
      // dispatch(resetCataloguesAndFilters());
    } catch (error) {
      dispatch({
        type: "extensions/UNINSTALL_FAILURE",
        errorMessage: "Failed to uninstall this extension.",
        meta: { error, extension }
      });
    }
  };
}

// TODO do i need to expose some sort of isLoading capability?
/**
 * Running install on an already installed extension will update it instead
 */
export function useInstallExtension(): (
  extension: ExtensionType
) => Promise<void> {
  const dispatch = useDispatch();

  return async extension => {
    try {
      const response = await fetch(
        Server.installExtension(extension.pkg_name),
        {
          method: "POST"
        }
      );

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      // const extension: ExtensionType = json.data[0];

      mutate(Server.extensions());

      // TODO: are these manual mutations actually needed?
      // dispatch({ type: RESET_SOURCES });
      // dispatch(resetCataloguesAndFilters());
    } catch (error) {
      dispatch({
        type: "extensions/INSTALL_FAILURE",
        errorMessage: "Failed to install this extension.",
        meta: { error, extension }
      });
    }
  };
}
