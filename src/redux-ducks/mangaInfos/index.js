// @flow
import type { Manga } from "@tachiweb/api-client";
import { createLoadingSelector } from "redux-ducks/loading";
import createCachedSelector from "re-reselect";
import type { GlobalState, Action } from "redux-ducks/reducers";
import {
  ADD_MANGA,
  FETCH_MANGA,
  FETCH_MANGA_CACHE,
  FETCH_MANGA_SUCCESS,
  UPDATE_MANGA,
  UPDATE_MANGA_SUCCESS,
  TOGGLE_FAVORITE,
  TOGGLE_FAVORITE_SUCCESS,
  SET_FLAG_REQUEST
} from "./actions";

// NOTE: for clarity, this will be called mangaInfos (with an s)
//       Info doesn't really have a plural, so I need to differentiate somehow
//
//       So mangaInfo refers to a single mangaInfo object
//       And mangaInfos refers to this state, which is the whole collection of mangaInfo-s

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{ [mangaId: number]: Manga }>;

export default function mangaInfosReducer(
  state: State = {},
  action: Action
): State {
  switch (action.type) {
    case ADD_MANGA:
      return { ...state, ...mangaArrayToObject(action.newManga) };

    case FETCH_MANGA_CACHE:
      return state;

    case FETCH_MANGA_SUCCESS:
      return { ...state, [action.mangaInfo.id]: action.mangaInfo };

    case UPDATE_MANGA_SUCCESS:
      return { ...state, [action.mangaInfo.id]: action.mangaInfo };

    case TOGGLE_FAVORITE_SUCCESS:
      return {
        ...state,
        [action.mangaId]: {
          ...state[action.mangaId],
          favorite: action.newFavoriteState
        }
      };

    case SET_FLAG_REQUEST:
      return {
        ...state,
        [action.mangaId]: {
          ...state[action.mangaId],
          flags: {
            ...state[action.mangaId].flags,
            [action.flag]: action.state
          }
        }
      };

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsMangaInfosLoading = createLoadingSelector([
  FETCH_MANGA,
  UPDATE_MANGA
]);

export const selectIsFavoriteToggling = createLoadingSelector([
  TOGGLE_FAVORITE
]);

export const selectMangaInfos = (state: GlobalState): State => state.mangaInfos;

export const selectMangaInfo = (state: GlobalState, mangaId: number): ?Manga =>
  state.mangaInfos[mangaId];

// selectIsFavorite(state, mangaId: number)
// returns boolean
export const selectIsFavorite = createCachedSelector(
  [selectMangaInfos, (_, mangaId: number) => mangaId],
  (mangaInfos, mangaId): boolean => {
    if (!mangaInfos[mangaId]) return false;

    return mangaInfos[mangaId].favorite;
  }
  // Cache Key
)((state, mangaId) => mangaId);

export const selectMangaFlags = (state: GlobalState, mangaId: number) =>
  state.mangaInfos[mangaId].flags;

// ================================================================================
// Helper Functions
// ================================================================================
function mangaArrayToObject(mangaArray: Array<Manga>): State {
  const mangaObject = {};
  mangaArray.forEach(manga => {
    mangaObject[manga.id] = manga;
  });
  return mangaObject;
}
