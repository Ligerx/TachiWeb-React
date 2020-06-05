// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { Manga, MangaFlags } from "@tachiweb/api-client";

export function useMangaInfo(mangaId: number) {
  const dispatch = useDispatch();

  return useSWR<Manga>(
    Server.mangaInfo(mangaId),
    () => Server.api().getManga(mangaId),
    {
      onError(error) {
        dispatch({
          type: "mangaInfos/FETCH_FAILURE",
          errorMessage: "Failed to get this manga's information",
          meta: { error, mangaId }
        });
      }
    }
  );
}

// TODO remove this placeholder
export const blah = 0;
