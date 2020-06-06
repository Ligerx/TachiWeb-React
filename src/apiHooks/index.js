// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { ExtensionType } from "types";
import { fetcherUnpackContent, fetcherUnpackData } from "./utils";

// NOTE: For any calls using the Server.api().{call}, I'm sort of hacking around SWR's intended usage pattern.
// I'm manually adding a unique key, then using the api call as the fetcher.
// This is because the api() calls fetch() directly and I don't have access to the url as the key.

export type UnreadMap = { [mangaId: number]: number };

export function useUnread() {
  const dispatch = useDispatch();

  return useSWR<UnreadMap>(
    Server.libraryUnread(),
    url => fetcherUnpackContent(url).then(content => unreadArrayToMap(content)),
    {
      onError(error) {
        dispatch({
          type: "library/FETCH_UNREAD_FAILURE",
          errorMessage: "Failed to get unread chapters for your library",
          meta: { error }
        });
      }
    }
  );
}

function unreadArrayToMap(
  unreadArray: { id: number, unread: number }[]
): UnreadMap {
  const newUnread = {};
  unreadArray.forEach(unreadObj => {
    newUnread[unreadObj.id] = unreadObj.unread;
  });
  return newUnread;
}

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

export * from "./mangaInfo";
export * from "./chapters";
export * from "./sources";
export * from "./library";
export * from "./categories";
