import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'sources/LOAD_REQUEST';
const SUCCESS = 'sources/LOAD_SUCCESS';
const FAILURE = 'sources/LOAD_FAILURE';

// ================================================================================
// Reducers
// ================================================================================
export default function sourcesReducer(state = [], action = {}) {
  switch (action.type) {
    case SUCCESS:
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
    dispatch({ type: REQUEST });

    return fetch(Server.sources())
      .then(
        res => res.json(),
        error =>
          dispatch({ type: FAILURE, errorMessage: 'Failed to load sources', meta: { error } }),
      )
      .then(json => dispatch({ type: SUCCESS, payload: json.content }));
  };
}
