// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { LibraryManga } from "@tachiweb/api-client";
import type { LibraryFlagsType, LibraryFlagsPossibleValueTypes } from "types";
import { useUpdateChapters } from "./chapters";
import {
  fetcherUnpackData,
  fetcherUnpackContent,
  serialPromiseChain
} from "./utils";

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

// TODO add a loading state here
export function useUpdateLibrary(): () => Promise<void> {
  const updateChapters = useUpdateChapters();
  const { data: libraryMangas } = useLibrary();

  return async () => {
    if (libraryMangas == null) return;

    // Create an array of promise functions
    // Since calling updateChapters runs the function, create an intermediate function
    const updateChapterPromises = libraryMangas.map(libraryManga => () =>
      updateChapters(libraryManga.manga.id)
    );

    serialPromiseChain(updateChapterPromises);
    // currently not throwing any errors in case the chapter update fails

    mutate(Server.library());
  };
}

export function useSetLibraryFlag(): (
  libraryFlags: LibraryFlagsType,
  flag: string,
  value: LibraryFlagsPossibleValueTypes
) => Promise<void> {
  const dispatch = useDispatch();

  return async (libraryFlags, flag, value) => {
    try {
      await fetch(Server.libraryFlags(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(libraryFlags)
      });
    } catch (error) {
      dispatch({
        type: "library/SET_FLAG_FAILURE",
        errorMessage: "Failed to update your library settings.",
        meta: { error, libraryFlags, flag, value }
      });
    }
  };
}
