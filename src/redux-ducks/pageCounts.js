import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'pageCounts/LOAD_REQUEST';
const SUCCESS = 'pageCounts/LOAD_SUCCESS';
const FAILURE = 'pageCounts/LOAD_FAILURE';
const CACHE = 'pageCounts/LOAD_CACHE';

// ================================================================================
// Reducers
// ================================================================================
export default function chaptersReducer(
  state = { pageCountsByMangaId: {}, isFetching: false, error: false },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS: {
      // TODO: Consider using a library like immutability-helper in the future?
      //       pageCount is nested data, making it a pain in the ass to update state immutably
      //       The logic here is hard to follow, and any changes would be time consuming to debug.
      const { mangaId, chapterId, pageCount } = action;

      let newState = state;
      newState = addMangaIdIfMissing(newState, mangaId);

      return {
        ...newState,
        pageCountsByMangaId: {
          ...state.pageCountsByMangaId,
          [mangaId]: {
            ...newState.pageCountsByMangaId[mangaId],
            [chapterId]: pageCount,
          },
        },
      };
    }
    case FAILURE:
      return { ...state, isFetching: false, error: true };
    case CACHE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchPageCount(mangaId, chapterId) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST });

    // Return manga's chapters' cached pageCount data if they're already in the store
    const pageCountsByChapterId = getState().pageCounts.pageCountsByMangaId[mangaId];
    if (pageCountsByChapterId && pageCountsByChapterId[chapterId]) {
      return dispatch({ type: CACHE });
    }

    return fetch(Server.pageCount(mangaId, chapterId))
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then(json => json.page_count)
      .then(pageCount =>
        dispatch({
          type: SUCCESS,
          mangaId,
          chapterId,
          pageCount,
        }));
  };
}

// ================================================================================
// Helper functions
// ================================================================================
function addMangaIdIfMissing(object, mangaId) {
  // Create the mangaId parent object if it isn't already there
  if (!object.pageCountsByMangaId[mangaId]) {
    return {
      ...object,
      pageCountsByMangaId: {
        ...object.pageCountsByMangaId,
        [mangaId]: {},
      },
    };
  }
  return object;
}
