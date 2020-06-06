// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { Manga, MangaViewer } from "@tachiweb/api-client";
import produce from "immer";

export function useMangaInfo(mangaId: number) {
  const dispatch = useDispatch();

  return useSWR<Manga>(
    Server.mangaInfo(mangaId),
    () => Server.api().getManga(mangaId),
    {
      onError(error) {
        dispatch({
          type: "mangaInfo/FETCH_FAILURE",
          errorMessage: "Failed to get this manga's information",
          meta: { error, mangaId }
        });
      }
    }
  );
}

export function useSetMangaViewer(): (
  mangaId: number,
  viewer: MangaViewer
) => Promise<void> {
  const dispatch = useDispatch();

  return async (mangaId, viewer) => {
    try {
      // Optimistic update
      mutate(
        Server.mangaInfo(mangaId),
        produce((draftMangaInfo: Manga) => {
          draftMangaInfo.viewer = viewer;
        }),
        false
      );

      await Server.api().setMangaViewer(mangaId, viewer);
      mutate(Server.mangaInfo(mangaId));
    } catch (error) {
      dispatch({
        type: "mangaInfo/SET_MANGA_VIEWER_FAILURE",
        errorMessage: "Failed to change your viewer setting for this manga.",
        meta: { error, mangaId, viewer }
      });
    }
  };
}

export function useUpdateMangaInfo(): (mangaId: number) => Promise<void> {
  const dispatch = useDispatch();

  return async mangaId => {
    try {
      await Server.api().updateMangaInfo(mangaId);
      mutate(Server.mangaInfo(mangaId));
    } catch (error) {
      dispatch({
        type: "mangaInfos/UPDATE_FAILURE",
        errorMessage: "Failed to update this manga's information",
        meta: { error }
      });
    }
  };
}
