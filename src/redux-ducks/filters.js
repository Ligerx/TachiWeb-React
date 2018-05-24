// @flow
import { Server } from 'api';
import type { FilterAnyType } from 'types/filters';

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = 'filters/FETCH_REQUEST';
const FETCH_SUCCESS = 'filters/FETCH_SUCCESS';
const FETCH_FAILURE = 'filters/FETCH_FAILURE';

export const CLEAR_FILTERS = 'filters/CLEAR_FILTERS';

// ================================================================================
// Reducers
// ================================================================================
// NOTE: filters should just store the initial filters received by the server
//       Any edited filters should just be held in local state
export default function filtersReducer(state: $ReadOnlyArray<FilterAnyType> = [], action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.filters;
    case CLEAR_FILTERS:
      return [];
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchFilters(sourceId: number) {
  return (dispatch: Function) => {
    dispatch({ type: FETCH_REQUEST, meta: { sourceId } });

    return fetch(Server.filters(sourceId))
      .then(
        res => res.json(),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: 'Failed to get the filters for this source',
            meta: { error },
          }),
      )
      .then(json => dispatch({ type: FETCH_SUCCESS, filters: json.content }));
  };
}
