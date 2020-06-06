// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { Manga, MangaViewer, MangaFlags } from "@tachiweb/api-client";
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

// TODO do I need to be able to support a loading state here?
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

export function useSetFlag(): (
  mangaInfo: Manga,
  flag: $Keys<MangaFlags>,
  state: string
) => Promise<void> {
  const dispatch = useDispatch();

  return async (mangaInfo, flag, state) => {
    const prevFlags = mangaInfo.flags;

    if (prevFlags[flag] === state) return;

    try {
      // setMangaFlags() requires an updated copy of the full flag object.
      await Server.api().setMangaFlags(mangaInfo.id, {
        ...prevFlags,
        [flag]: state
      });
      mutate(Server.mangaInfo(mangaInfo.id));
    } catch (error) {
      dispatch({
        type: "mangaInfos/SET_FLAG_FAILURE",
        errorMessage: "Failed to update this manga's filter and sort settings.",
        meta: { error, mangaInfo, flag, state }
      });
    }
  };
}
