import API from 'api';

// Actions
const REQUEST = 'library/LOAD_REQUEST';
const SUCCESS = 'library/LOAD_SUCCESS';
const FAILURE = 'library/LOAD_FAILURE';

// Reducers

// TODO: remove 'error' flag when error is fixed? Is there a more efficient way to do this?
export default function libraryReducer(
  state = { mangaLibrary: [], isFetching: false, error: false },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS:
      return { ...state, mangaLibrary: action.payload, isFetching: false };
    case FAILURE:
      // Don't over write existing manga in store if an error happens
      // FIXME: error payload? error boolean? what do.
      console.error(action.payload);
      return { ...state, isFetching: false, error: true };
    default:
      return state;
  }
}

// Action Creators
export function fetchLibrary() {
  return (dispatch, getState) => {
    // Return cached data if it's in the store
    if (getState().library.mangaLibrary.length > 0) {
      return null;
    }

    dispatch({ type: REQUEST });

    return fetch(API.library())
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then(json => dispatch({ type: SUCCESS, payload: json.content }));
  };
}
