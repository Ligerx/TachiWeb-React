// @flow
import type { Manga } from "@tachiweb/api-client";

// ================================================================================
// Fetch Manga
// ================================================================================

// Action Constants and Types
export const FETCH_MANGA = "mangaInfos/FETCH";

export const FETCH_MANGA_REQUEST = "mangaInfos/FETCH_REQUEST";
type FETCH_MANGA_REQUEST_TYPE = "mangaInfos/FETCH_REQUEST";

export const FETCH_MANGA_SUCCESS = "mangaInfos/FETCH_SUCCESS";
type FETCH_MANGA_SUCCESS_TYPE = "mangaInfos/FETCH_SUCCESS";

export const FETCH_MANGA_FAILURE = "mangaInfos/FETCH_FAILURE";
type FETCH_MANGA_FAILURE_TYPE = "mangaInfos/FETCH_FAILURE";

export const FETCH_MANGA_CACHE = "mangaInfos/FETCH_CACHE";
type FETCH_MANGA_CACHE_TYPE = "mangaInfos/FETCH_CACHE";

// Action Object Types
type FetchMangaRequestAction = { type: FETCH_MANGA_REQUEST_TYPE, meta: Object };

type FetchMangaSuccessAction = {
  type: FETCH_MANGA_SUCCESS_TYPE,
  mangaInfo: Manga
};

type FetchMangaFailureAction = {
  type: FETCH_MANGA_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

type FetchMangaCacheAction = { type: FETCH_MANGA_CACHE_TYPE };

// ================================================================================
// Update Manga
// ================================================================================

// Action Constants and Types
export const UPDATE_MANGA = "mangaInfos/UPDATE";

export const UPDATE_MANGA_REQUEST = "mangaInfos/UPDATE_REQUEST";
type UPDATE_MANGA_REQUEST_TYPE = "mangaInfos/UPDATE_REQUEST";

export const UPDATE_MANGA_SUCCESS = "mangaInfos/UPDATE_SUCCESS";
type UPDATE_MANGA_SUCCESS_TYPE = "mangaInfos/UPDATE_SUCCESS";

export const UPDATE_MANGA_FAILURE = "mangaInfos/UPDATE_FAILURE";
type UPDATE_MANGA_FAILURE_TYPE = "mangaInfos/UPDATE_FAILURE";

// Action Object Types
type UpdateMangaRequestAction = {
  type: UPDATE_MANGA_REQUEST_TYPE,
  meta: Object
};

type UpdateMangaSuccessAction = {
  // This indicates the manga has been rescraped. You should fetch it again after this.
  type: UPDATE_MANGA_SUCCESS_TYPE,
  mangaInfo: Manga
};

type UpdateMangaFailureAction = {
  type: UPDATE_MANGA_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Toggle Favorite
// ================================================================================

// Action Constants and Types
export const TOGGLE_FAVORITE = "mangaInfos/TOGGLE_FAVORITE";

export const TOGGLE_FAVORITE_REQUEST = "mangaInfos/TOGGLE_FAVORITE_REQUEST";
type TOGGLE_FAVORITE_REQUEST_TYPE = "mangaInfos/TOGGLE_FAVORITE_REQUEST";

export const TOGGLE_FAVORITE_SUCCESS = "mangaInfos/TOGGLE_FAVORITE_SUCCESS";
type TOGGLE_FAVORITE_SUCCESS_TYPE = "mangaInfos/TOGGLE_FAVORITE_SUCCESS";

export const TOGGLE_FAVORITE_FAILURE = "mangaInfos/TOGGLE_FAVORITE_FAILURE";
type TOGGLE_FAVORITE_FAILURE_TYPE = "mangaInfos/TOGGLE_FAVORITE_FAILURE";

// Action Object Types
type ToggleFavoriteRequestAction = {
  type: TOGGLE_FAVORITE_REQUEST_TYPE,
  meta: Object
};

type ToggleFavoriteSuccessAction = {
  type: TOGGLE_FAVORITE_SUCCESS_TYPE,
  mangaId: number,
  newFavoriteState: boolean
};

type ToggleFavoriteFailureAction = {
  type: TOGGLE_FAVORITE_FAILURE_TYPE,
  errorMessage: string
};

// ================================================================================
// Add Manga
// ================================================================================

export const ADD_MANGA = "mangaInfos/ADD_MANGA";
type ADD_MANGA_TYPE = "mangaInfos/ADD_MANGA";

export type AddMangaAction = {
  type: ADD_MANGA_TYPE,
  newManga: Array<Manga>
};

// ================================================================================
// Set Manga Flag
// ================================================================================

// Action Constants and Types
export const SET_FLAG_REQUEST = "mangaInfos/SET_FLAG_REQUEST";
type SET_FLAG_REQUEST_TYPE = "mangaInfos/SET_FLAG_REQUEST";

export const SET_FLAG_SUCCESS = "mangaInfos/SET_FLAG_SUCCESS";
type SET_FLAG_SUCCESS_TYPE = "mangaInfos/SET_FLAG_SUCCESS";

export const SET_FLAG_FAILURE = "mangaInfos/SET_FLAG_FAILURE";
type SET_FLAG_FAILURE_TYPE = "mangaInfos/SET_FLAG_FAILURE";

export const SET_FLAG_NO_CHANGE = "mangaInfos/SET_FLAG_NO_CHANGE";
type SET_FLAG_NO_CHANGE_TYPE = "mangaInfos/SET_FLAG_NO_CHANGE";

// Action Object Types
type SetFlagRequestAction = {
  type: SET_FLAG_REQUEST_TYPE,
  mangaId: number,
  // flag and state correspond with the key value pair of MangaInfoFlagsType
  // No obvious way to automatically type this in Flow
  flag: string,
  state: string
};

type SetFlagSuccessAction = { type: SET_FLAG_SUCCESS_TYPE };

type SetFlagFailureAction = { type: SET_FLAG_FAILURE_TYPE };

type SetFlagNoChangeAction = { type: SET_FLAG_NO_CHANGE_TYPE, meta: Object };

// ================================================================================
// Consolidated Action Type
// ================================================================================
export type MangaInfosAction =
  | FetchMangaRequestAction
  | FetchMangaSuccessAction
  | FetchMangaFailureAction
  | FetchMangaCacheAction
  | UpdateMangaRequestAction
  | UpdateMangaSuccessAction
  | UpdateMangaFailureAction
  | ToggleFavoriteRequestAction
  | ToggleFavoriteSuccessAction
  | ToggleFavoriteFailureAction
  | AddMangaAction
  | SetFlagRequestAction
  | SetFlagSuccessAction
  | SetFlagFailureAction
  | SetFlagNoChangeAction;
