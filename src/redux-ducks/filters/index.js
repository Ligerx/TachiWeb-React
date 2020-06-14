// @flow
import type { FilterAnyType } from "types/filters";
import type { Action } from "redux-ducks/reducers";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  REVERT_TO_INITIAL_FILTERS,
  UPDATE_LAST_USED_FILTERS,
  UPDATE_CURRENT_FILTERS,
  UPDATE_FILTER,
  RESET_FILTERS
} from "./actions";

// NOTE: Filters are currently only being used for 1 catalogue/source at a time, so that's all this supports

// ===============================C=================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  initialFilters: $ReadOnlyArray<FilterAnyType>,
  lastUsedFilters: $ReadOnlyArray<FilterAnyType>, // use this for the actual search fetches

  // having this in the redux store is going to create a ton of actions being logged
  // the benefit is that any un-searched changes will remain when you leave and return to catalogue
  currentFilters: $ReadOnlyArray<FilterAnyType> // stores changes that haven't been submitted yet
}>;

const initialState: State = {
  initialFilters: [],
  lastUsedFilters: [],
  currentFilters: []
};

export default function filtersReducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case RESET_FILTERS:
      return initialState;

    case FETCH_REQUEST:
      return initialState;

    case FETCH_SUCCESS:
      return {
        initialFilters: action.filters,
        lastUsedFilters: action.filters,
        currentFilters: action.filters
      };

    case REVERT_TO_INITIAL_FILTERS:
      // This is specifically for what data in the UI the user is seeing/using
      return { ...state, currentFilters: state.initialFilters };

    case UPDATE_LAST_USED_FILTERS:
      // record the current filters as what was last used to search
      return { ...state, lastUsedFilters: state.currentFilters };

    case UPDATE_CURRENT_FILTERS:
      return { ...state, currentFilters: action.filters };

    case UPDATE_FILTER: {
      const { filter, index } = action;

      const oldFilters = state.currentFilters;
      const newFilters = [
        ...oldFilters.slice(0, index),
        filter,
        ...oldFilters.slice(index + 1)
      ];

      return { ...state, currentFilters: newFilters };
    }

    default:
      return state;
  }
}
