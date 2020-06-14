// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { ChapterType, PageCounts } from "types";
import type { Manga } from "@tachiweb/api-client";
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

/**
 * Update one chapter's `read` and `last_page_read` properties
 */
export function useUpdateReadingStatus(): (
  mangaInfo: Manga,
  chapter: ChapterType,
  readPage: number,
  pageCount: number
) => Promise<void> {
  const dispatch = useDispatch();

  return async (mangaInfo, chapter, readPage, pageCount) => {
    // Escape early if no update is needed
    if (chapter.read) return;
    if (readPage === chapter.last_page_read) return;

    const didReadLastPage = readPage === pageCount - 1;

    try {
      await fetch(
        Server.updateReadingStatus(
          mangaInfo.id,
          chapter.id,
          readPage,
          didReadLastPage
        )
      );
      mutate(Server.chapters(mangaInfo.id));
    } catch (error) {
      dispatch({
        type: "chapters/UPDATE_READING_STATUS_FAILURE",
        errorMessage: "Failed to save your reading status",
        meta: { error, mangaInfo, chapter, readPage, pageCount }
      });
    }
  };
}

/**
 * Request the server to re-scrape the source site for chapters.
 * If there have been any changes, re-fetch the cached chapter list from the server.
 */
export function useUpdateChapters(
  setIsLoading?: (loading: boolean) => any = () => {}
): (mangaId: number) => Promise<void> {
  const dispatch = useDispatch();

  return async mangaId => {
    setIsLoading(true);

    try {
      const response = await fetch(Server.updateMangaChapters(mangaId));
      const json = await response.json();

      if (!json.success) {
        throw new Error("json returned success = false");
      }

      mutate(Server.chapters(mangaId));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch({
        type: "chapters/UPDATE_FAILURE",
        errorMessage: "Failed to update the chapters list",
        meta: { error, mangaId }
      });
    }
  };
}

// TODO: Update this function (and maybe updateReadingStatus()) to new api version
export function useToggleRead(): (
  mangaId: number,
  chapterId: number,
  read: boolean
) => Promise<void> {
  const dispatch = useDispatch();

  return async (mangaId, chapterId, read) => {
    try {
      await fetch(Server.updateReadingStatus(mangaId, chapterId, 0, read));
      mutate(Server.chapters(mangaId));
    } catch (error) {
      dispatch({
        type: "chapters/TOGGLE_READ_FAILURE",
        errorMessage: `Failed to mark chapter as ${read ? "read" : "unread"}`,
        meta: { error }
      });
    }
  };
}
