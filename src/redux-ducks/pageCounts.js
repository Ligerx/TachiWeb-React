import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = 'pageCounts/FETCH_REQUEST';
const FETCH_SUCCESS = 'pageCounts/FETCH_SUCCESS';
const FETCH_FAILURE = 'pageCounts/FETCH_FAILURE';
const FETCH_CACHE = 'pageCounts/FETCH_CACHE';

// ================================================================================
// Reducers
// ================================================================================
export default function chaptersReducer(state = { pageCountsByChapterId: {} }, action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        pageCountsByChapterId: {
          ...state.pageCountsByChapterId,
          [action.chapterId]: action.pageCount,
        },
      };
    case FETCH_CACHE:
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
      return dispatch({ type: FETCH_CACHE });
    }

    dispatch({ type: FETCH_REQUEST });

    return fetch(Server.pageCount(mangaId, chapterId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: 'Failed to get page count',
            meta: { error },
          }),
      )
      .then(json =>
        dispatch({
          type: FETCH_SUCCESS,
          chapterId,
          pageCount: json.page_count,
        }));
  };
}
