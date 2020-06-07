// @flow
import useSWR from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import { fetcherUnpackContent } from "./utils";

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

export * from "./mangaInfo";
export * from "./chapters";
export * from "./sources";
export * from "./library";
export * from "./categories";
export * from "./extensions";
export * from "./library";
