// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { ChapterType } from "types";
import { fetcherUnpackContent } from "./utils";

export function useChapters(mangaId: number) {
  const dispatch = useDispatch();

  return useSWR<ChapterType[]>(Server.chapters(mangaId), fetcherUnpackContent, {
    onError(error) {
      dispatch({
        type: "chapters/FETCH_FAILURE",
        errorMessage: "Failed to load chapters",
        meta: { error, mangaId }
      });
    }
  });
}

// TODO remove this placeholder
export const blah = 0;
