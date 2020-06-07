// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { LibraryManga } from "@tachiweb/api-client";
import type { LibraryFlagsType } from "types";
import { fetcherUnpackData } from "./utils";

export function useLibrary() {
  const dispatch = useDispatch();

  return useSWR<LibraryManga[]>(
    Server.library(),
    () => Server.api().getLibraryMangas(true, true, true),
    {
      onError(error) {
        dispatch({
          type: "library/FETCH_FAILURE",
          errorMessage: "Failed to load your library.",
          meta: { error }
        });
      }
    }
  );
}

export function useLibraryFlags() {
  const dispatch = useDispatch();

  return useSWR<LibraryFlagsType>(Server.libraryFlags(), fetcherUnpackData, {
    onError(error) {
      dispatch({
        type: "library/FETCH_FLAGS_FAILURE",
        errorMessage: "Failed to load your library settings.",
        meta: { error }
      });
    }
  });
}
