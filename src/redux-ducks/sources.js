import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = 'sources/FETCH_REQUEST';
const FETCH_SUCCESS = 'sources/FETCH_SUCCESS';
const FETCH_FAILURE = 'sources/FETCH_FAILURE';

// ================================================================================
// Reducers
// ================================================================================
export default function sourcesReducer(state = [], action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchSources() {
  return (dispatch) => {
    dispatch({ type: FETCH_REQUEST });

    return fetch(Server.sources())
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: 'Failed to load sources',
            meta: { error },
          }),
      )
      .then(json => dispatch({ type: FETCH_SUCCESS, payload: json.content }));
  };
}
