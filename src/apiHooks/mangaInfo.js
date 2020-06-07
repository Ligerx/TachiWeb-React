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

export function useToggleFavorite(): (
  mangaId: number,
  isCurrentlyFavorite: boolean
) => Promise<void> {
  const dispatch = useDispatch();

  return async (mangaId, isCurrentlyFavorite) => {
    try {
      // TODO: Remove toString when https://github.com/OpenAPITools/openapi-generator/pull/2499 is merged
      Server.api().setMangaFavorited(
        mangaId,
        (!isCurrentlyFavorite).toString()
      );
      mutate(Server.mangaInfo(mangaId));
    } catch (error) {
      dispatch({
        type: "mangaInfos/TOGGLE_FAVORITE_FAILURE",
        errorMessage: isCurrentlyFavorite
          ? "Failed to unfavorite this manga"
          : "Failed to favorite this manga"
      });
    }
  };
}

// TODO:
// [July 24, 2019] There's no batch method for setting a manga's favorite status. Currently just
// looping over toggleFavorite, but should probably refactor these 2 methods at some point.
export function useUnfavoriteMultiple(): (
  mangaIds: Array<number>
) => Promise<void> {
  const toggleFavorite = useToggleFavorite();

  return async mangaIds => {
    // not sure if I need to chain promises instead of doing them all at once
    mangaIds.forEach(mangaId => toggleFavorite(mangaId, true));
  };
}
