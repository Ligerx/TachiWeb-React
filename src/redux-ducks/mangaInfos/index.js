// @flow
import type { Manga } from "@tachiweb/api-client";
import produce from "immer";
import type { Action } from "redux-ducks/reducers";
import {
  ADD_MANGA,
  FETCH_MANGA_CACHE,
  FETCH_MANGA_SUCCESS,
  UPDATE_MANGA_SUCCESS,
  TOGGLE_FAVORITE_SUCCESS,
  SET_FLAG_REQUEST,
  SET_VIEWER_REQUEST
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
  // Mutate Immer 'draft' to get an immutable copy of the new state
  /* eslint-disable no-param-reassign, consistent-return */
  return produce(state, draft => {
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

      // Using immer here but I haven't migrated the whole reducer to immer yet
      case SET_VIEWER_REQUEST: {
        const { mangaId, viewer } = action.payload;
        draft[mangaId].viewer = viewer;
        break;
      }

      default:
        return state;
    }
    /* eslint-enable no-param-reassign, consistent-return */
  });
}

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
