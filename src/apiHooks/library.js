// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { LibraryManga } from "@tachiweb/api-client";
import type { LibraryFlagsType, LibraryFlagsPossibleValueTypes } from "types";
import { useUpdateChapters } from "./chapters";
import { fetcherUnpackData, serialPromiseChain } from "./utils";

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

    // TODO do I need to also useUpdateMangaInfo here?

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
    const newFlags = { ...libraryFlags, [flag]: value };

    try {
      await fetch(Server.libraryFlags(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFlags)
      });
      mutate(Server.libraryFlags());
    } catch (error) {
      dispatch({
        type: "library/SET_FLAG_FAILURE",
        errorMessage: "Failed to update your library settings.",
        meta: { error, libraryFlags, newFlags, flag, value }
      });
    }
  };
}

// TODO: add ability to do loading state here?
// TODO: prob also need to add a failure state here as well (in addition to the redux dispatch error)
export function useUploadRestoreFile(): (file: File) => Promise<void> {
  const dispatch = useDispatch();

  return async file => {
    try {
      // TODO: I'm not currently checking if the response message says failure or success
      await fetch(Server.restoreUpload(), uploadPostParameters(file));
    } catch (error) {
      dispatch({
        type: "library/UPLOAD_RESTORE_FAILURE",
        errorMessage: `Failed to restore library from ${file.name}`,
        meta: { error, file }
      });
    }
  };
}

function uploadPostParameters(file: File): Object {
  const formData = new FormData();
  formData.append("uploaded_file", file);

  return { method: "POST", body: formData };
}
