// @flow
import type { FilterAnyType } from "types/filters";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { RESET_STATE as RESET_CATALOGUE_STATE } from "redux-ducks/catalogue/actions";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  RESET_FILTERS,
  UPDATE_LAST_USED_FILTERS,
  UPDATE_CURRENT_FILTERS,
  UPDATE_FILTER
} from "./actions";

// ================================================================================
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
    case RESET_CATALOGUE_STATE:
      // SIDE EFFECT based on catalogue actions
      return initialState;

    case FETCH_REQUEST:
      return initialState;

    case FETCH_SUCCESS:
      return {
        initialFilters: action.filters,
        lastUsedFilters: action.filters,
        currentFilters: action.filters
      };

    case RESET_FILTERS:
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

// ================================================================================
// Selectors
// ================================================================================

export const selectInitialFilters = (
  state: GlobalState
): $ReadOnlyArray<FilterAnyType> => state.filters.initialFilters;
export const selectLastUsedFilters = (
  state: GlobalState
): $ReadOnlyArray<FilterAnyType> => state.filters.lastUsedFilters;
export const selectCurrentFilters = (
  state: GlobalState
): $ReadOnlyArray<FilterAnyType> => state.filters.currentFilters;

export const selectFilterAtIndex = (
  state: GlobalState,
  index: number
): FilterAnyType => state.filters.currentFilters[index];

export const selectFiltersLength: GlobalState => number = createSelector(
  // Optimization
  // The length of filters is constant, so we can look outside of currentFilters
  [selectInitialFilters],
  (filters): number => filters.length
);

export const selectFilterTypeAtIndex: (
  state: GlobalState,
  index: number
) => string = createCachedSelector(
  // Optimization
  // The type and position of a filter is constant, so we can look outside of currentFilters
  [selectInitialFilters, (_, index) => index],
  (filters, index) => filters[index]._type // eslint-disable-line no-underscore-dangle
  // Cache Key
)((_, index) => index);
