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

export function useReloadExtensions(
  setIsLoading?: (loading: boolean) => any = () => {}
): () => Promise<void> {
  const dispatch = useDispatch();

  return async () => {
    try {
      setIsLoading(true);

      const response = await fetch(Server.reloadExtensions(), {
        method: "POST"
      });

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      mutate(Server.extensions());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch({
        type: "extensions/RELOAD_FAILURE",
        errorMessage: "Failed to reload extensions.",
        meta: { error }
      });
    }
  };
}

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
    } catch (error) {
      dispatch({
        type: "extensions/UNINSTALL_FAILURE",
        errorMessage: "Failed to uninstall this extension.",
        meta: { error, extension }
      });
    }
  };
}

/**
 * Running install on an already installed extension will update it instead
 */
export function useInstallExtension(
  setIsLoading?: (loading: boolean) => any = () => {}
): (extension: ExtensionType) => Promise<void> {
  const dispatch = useDispatch();

  return async extension => {
    try {
      setIsLoading(true);

      const response = await fetch(
        Server.installExtension(extension.pkg_name),
        {
          method: "POST"
        }
      );

      const json = await response.json();
      if (!json.success) throw new Error("success = false in returned JSON");

      mutate(Server.extensions());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch({
        type: "extensions/INSTALL_FAILURE",
        errorMessage: "Failed to install this extension.",
        meta: { error, extension }
      });
    }
  };
}
