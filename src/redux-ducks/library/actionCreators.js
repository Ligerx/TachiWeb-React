// @flow
import { Server } from "api";
import type { LibraryManga } from "@tachiweb/api-client";
import { handleHTMLError, transformToMangaIdsArray } from "redux-ducks/utils";
import type { ThunkAction } from "redux-ducks/reducers";
import type { LibraryFlagsPossibleValueTypes } from "types";
import { ADD_MANGA } from "redux-ducks/mangaInfos/actions";
import { updateChapters } from "redux-ducks/chapters/actionCreators";
import {
  selectLibraryMangaInfos,
  selectShouldReloadLibrary,
  selectIsLibraryFlagsLoaded,
  selectLibraryFlags
} from ".";
import {
  FETCH_LIBRARY_CACHE,
  FETCH_LIBRARY_REQUEST,
  FETCH_LIBRARY_SUCCESS,
  FETCH_LIBRARY_FAILURE,
  UPLOAD_RESTORE_REQUEST,
  UPLOAD_RESTORE_SUCCESS,
  UPLOAD_RESTORE_FAILURE,
  FETCH_LIBRARY_FLAGS_CACHE,
  FETCH_LIBRARY_FLAGS_REQUEST,
  FETCH_LIBRARY_FLAGS_SUCCESS,
  FETCH_LIBRARY_FLAGS_FAILURE,
  SET_FLAG_SUCCESS,
  SET_FLAG_REQUEST,
  SET_FLAG_FAILURE
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
type Options = { ignoreCache?: boolean };
export function fetchLibrary({
  ignoreCache = false
}: Options = {}): ThunkAction {
  return (dispatch, getState) => {
    // Return cached mangaLibrary if it's been loaded before
    if (!ignoreCache && !selectShouldReloadLibrary(getState())) {
      return Promise.resolve().then(dispatch({ type: FETCH_LIBRARY_CACHE }));
    }

    dispatch({ type: FETCH_LIBRARY_REQUEST });

    return Server.api()
      .getLibraryMangas(true, true, true)
      .then(
        libraryMangas => {
          const mangas = libraryMangas.map(manga => manga.manga);
          const mangaIds = transformToMangaIdsArray(mangas);

          dispatch({ type: ADD_MANGA, newManga: mangas });
          dispatch({
            type: FETCH_LIBRARY_SUCCESS,
            mangaIds,
            downloaded: transformLibraryMangaField(libraryMangas, "downloaded"),
            totalChaptersSortIndexes: transformLibraryMangaField(
              libraryMangas,
              "totalChaptersIndex"
            ),
            lastReadSortIndexes: transformLibraryMangaField(
              libraryMangas,
              "lastReadIndex"
            )
          });
        },
        error =>
          dispatch({
            type: FETCH_LIBRARY_FAILURE,
            errorMessage: "Failed to load your library",
            meta: { error }
          })
      );
  };
}

export function updateLibrary(): ThunkAction {
  return (dispatch, getState) => {
    // https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
    function serialPromiseChain(promiseArray) {
      return promiseArray.reduce(
        (promiseChain, currentPromise) =>
          promiseChain.then(() => currentPromise()),
        Promise.resolve([])
      );
    }

    const library = selectLibraryMangaInfos(getState());

    // Create an array of promise functions
    // Since calling updateChapters runs the function, create an intermediate function
    const updateChapterPromises = library.map(mangaInfo => () =>
      dispatch(updateChapters(mangaInfo.id))
    );

    return serialPromiseChain(updateChapterPromises).then(() => {
      dispatch(fetchLibrary({ ignoreCache: true }));
    });
  };
}

export function uploadRestoreFile(file: File): ThunkAction {
  return dispatch => {
    dispatch({ type: UPLOAD_RESTORE_REQUEST });

    return fetch(Server.restoreUpload(), uploadPostParameters(file))
      .then(handleHTMLError)
      .then(
        // TODO: I'm not currently checking if the response message says failure or success
        () => dispatch({ type: UPLOAD_RESTORE_SUCCESS }),
        error =>
          dispatch({
            type: UPLOAD_RESTORE_FAILURE,
            errorMessage: `Failed to restore library from ${file.name}`,
            meta: { error }
          })
      );
  };
}

export function fetchLibraryFlags(): ThunkAction {
  return (dispatch, getState) => {
    if (selectIsLibraryFlagsLoaded(getState())) {
      return dispatch({ type: FETCH_LIBRARY_FLAGS_CACHE });
    }

    dispatch({ type: FETCH_LIBRARY_FLAGS_REQUEST });

    return fetch(Server.libraryFlags())
      .then(handleHTMLError)
      .then(
        json =>
          dispatch({ type: FETCH_LIBRARY_FLAGS_SUCCESS, flags: json.data }),
        error =>
          dispatch({
            type: FETCH_LIBRARY_FLAGS_FAILURE,
            errorMessage: "Failed to load your library settings.",
            meta: { error }
          })
      );
  };
}

export function setLibraryFlag(
  flag: string,
  value: LibraryFlagsPossibleValueTypes
): ThunkAction {
  // Updating the store without waiting for the server to reply
  return (dispatch, getState) => {
    dispatch({ type: SET_FLAG_REQUEST, flag, value });

    return fetch(Server.libraryFlags(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectLibraryFlags(getState()))
    })
      .then(handleHTMLError)
      .then(
        () => dispatch({ type: SET_FLAG_SUCCESS }),
        () => dispatch({ type: SET_FLAG_FAILURE })
      );
  };
}

// ================================================================================
// Helper functions
// ================================================================================
type Return = { [mangaId: number]: number };

function uploadPostParameters(file: File): Object {
  const formData = new FormData();
  formData.append("uploaded_file", file);

  return { method: "POST", body: formData };
}

function transformLibraryMangaField(
  libraryMangas: Array<LibraryManga>,
  field: string
): Return {
  const newMappings = {};
  libraryMangas.forEach(libraryManga => {
    newMappings[libraryManga.manga.id] = libraryManga[field];
  });
  return newMappings;
}
