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
// The state is an object with chapterId keys pointing to pageCount values
// i.e. { chapterId: pageCount }
export default function chaptersReducer(state = {}, action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        [action.chapterId]: action.pageCount,
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
    if (getState().pageCounts[chapterId]) {
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
