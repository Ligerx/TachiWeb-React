// @flow
import type { FilterAnyType } from "types/filters";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";
import { createLoadingSelector } from "redux-ducks/loading";
import {
  FETCH_FILTERS,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  REVERT_TO_INITIAL_FILTERS,
  UPDATE_LAST_USED_FILTERS,
  UPDATE_CURRENT_FILTERS,
  UPDATE_FILTER,
  RESET_FILTERS
} from "./actions";

// NOTE: Filters are currently only being used for 1 catalogue/source at a time, so that's all this supports

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

// ================================================================================
// Selectors
// ================================================================================

export const selectIsFiltersLoading = createLoadingSelector([FETCH_FILTERS]);

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

/**
 * Useful as a sort of existence check. If length > 0, you know that filters exist.
 */
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
  (filters, index): string => filters[index]._type // eslint-disable-line no-underscore-dangle
  // Cache Key
)((_, index) => index);
