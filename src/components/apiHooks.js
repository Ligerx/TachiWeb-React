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

  return useSWR<{ id: number, unread: number }[]>(
    Server.libraryUnread(),
    fetcherUnpackContent,
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
