// @flow
import useSWR from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";

function fetcher(url) {
  return fetch(url).then(res => res.json());
}

function fetcherUnpackContent(url) {
  return fetcher(url).then(json => json.content);
}

export function useUnread() {
  const dispatch = useDispatch();

  return useSWR<{ [mangaId: number]: number }>(
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
): { [mangaId: number]: number } {
  const newUnread = {};
  unreadArray.forEach(unreadObj => {
    newUnread[unreadObj.id] = unreadObj.unread;
  });
  return newUnread;
}
