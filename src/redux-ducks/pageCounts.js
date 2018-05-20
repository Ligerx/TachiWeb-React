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
export default function chaptersReducer(state = { pageCountsByChapterId: {} }, action = {}) {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        pageCountsByChapterId: {
          ...state.pageCountsByChapterId,
          [action.chapterId]: action.pageCount,
        },
      };
    case CACHE:
      return state;
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchPageCount(mangaId, chapterId) {
  return (dispatch, getState) => {
    // Return manga's chapters' cached pageCount data if they're already in the store
    const { pageCountsByChapterId } = getState().pageCounts;
    if (pageCountsByChapterId[chapterId]) {
      return dispatch({ type: CACHE });
    }

    dispatch({ type: REQUEST });

    return fetch(Server.pageCount(mangaId, chapterId))
      .then(
        res => res.json(),
        error =>
          dispatch({ type: FAILURE, errorMessage: 'Failed to get page count', meta: { error } }),
      )
      .then(json =>
        dispatch({
          type: SUCCESS,
          chapterId,
          pageCount: json.page_count,
        }));
  };
}
