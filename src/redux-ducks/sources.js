import { Server } from 'api';

// Actions
const REQUEST = 'chapters/LOAD_REQUEST';
const SUCCESS = 'chapters/LOAD_SUCCESS';
const FAILURE = 'chapters/LOAD_FAILURE';

// Reducers
export default function sourcesReducer(
  state = { sources: [], isFetching: false, error: false },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS:
      return {
        ...state,
        sources: [...state.sources, ...action.payload],
        isFetching: false,
      };
    case FAILURE:
      return { ...state, isFetching: false, error: true };
    default:
      return state;
  }
}

// Action Creators
export function fetchSources() {
  return (dispatch) => {
    dispatch({ type: REQUEST });

    return fetch(Server.sources())
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then(json => dispatch({ type: SUCCESS, payload: json.contents }));
  };
}
