import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'filters/LOAD_REQUEST';
const SUCCESS = 'filters/LOAD_SUCCESS';
const FAILURE = 'filters/LOAD_FAILURE';

const CLEAR_FILTERS = 'filters/CLEAR_FILTERS';
export { CLEAR_FILTERS };

// ================================================================================
// Reducers
// ================================================================================
// NOTE: filters should just store the initial filters received by the server
//       Any edited filters should just be held in local state
export default function filtersReducer(state = null, action = {}) {
  switch (action.type) {
    case SUCCESS:
      return action.filters;
    case CLEAR_FILTERS:
      return null;
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchFilters(sourceId) {
  return (dispatch) => {
    dispatch({ type: REQUEST, meta: { sourceId } });

    return fetch(Server.filters(sourceId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FAILURE,
            errorMessage: 'Failed to get the filters for this source',
            meta: { error },
          }),
      )
      .then(json => dispatch({ type: SUCCESS, filters: json.content }));
  };
}
