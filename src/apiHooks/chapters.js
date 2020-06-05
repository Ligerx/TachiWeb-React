// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { ChapterType, PageCounts } from "types";
import { fetcher, fetcherUnpackContent } from "./utils";

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

export function usePageCount(mangaId: ?number, chapterId: ?number) {
  const dispatch = useDispatch();

  const hasDefinedParams = mangaId != null && chapterId != null;

  return useSWR<PageCounts>(
    hasDefinedParams ? Server.pageCount(mangaId, chapterId) : null,
    url => fetcher(url).then(json => json.page_count),
    {
      onError(error) {
        dispatch({
          type: "pageCounts/FETCH_FAILURE",
          errorMessage: "Failed to get page count",
          meta: { error, mangaId, chapterId }
        });
      }
    }
  );
}
