// @flow
import { Server } from "api";
import type { FilterAnyType, FilterSelect } from "types/filters";
import { handleHTMLError } from "redux-ducks/utils";
import { RESET_STATE as RESET_CATALOGUE_STATE } from "redux-ducks/catalogue";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = "filters/FETCH_REQUEST";
const FETCH_SUCCESS = "filters/FETCH_SUCCESS";
const FETCH_FAILURE = "filters/FETCH_FAILURE";

const RESET_FILTERS = "filters/RESET_FILTERS";
const UPDATE_LAST_USED_FILTERS = "filters/UPDATE_LAST_USED_FILTERS";
const UPDATE_CURRENT_FILTERS = "filters/UPDATE_CURRENT_FILTERS";

const UPDATE_FILTER = "filters/UPDATE_FILTER";

// ================================================================================
// Reducers
// ================================================================================
type State = {
  +initialFilters: $ReadOnlyArray<FilterAnyType>,
  +lastUsedFilters: $ReadOnlyArray<FilterAnyType>, // use this for the actual search fetches

  // having this in the redux store is going to create a ton of actions being logged
  // the benefit is that any un-searched changes will remain when you leave and return to catalogue
  +currentFilters: $ReadOnlyArray<FilterAnyType> // stores changes that haven't been submitted yet
};
const initialState: State = {
  initialFilters: [],
  lastUsedFilters: [],
  currentFilters: []
};
export default function filtersReducer(
  state: State = initialState,
  action = {}
) {
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

export const selectInitialFilters = (state): Array<FilterAnyType> =>
  state.filters.initialFilters;
export const selectLastUsedFilters = (state): Array<FilterAnyType> =>
  state.filters.lastUsedFilters;
export const selectCurrentFilters = (state): Array<FilterAnyType> =>
  state.filters.currentFilters;

export const selectFilterAtIndex = (state, index): FilterAnyType =>
  state.filters.currentFilters[index];

export const selectFiltersLength = createSelector(
  // Optimization
  // The length of filters is constant, so we can look outside of currentFilters
  [selectInitialFilters],
  (filters): Array<FilterAnyType> => filters.length
);

// selectFilterTypeAtIndex(state, index)
export const selectFilterTypeAtIndex = createCachedSelector(
  // Optimization
  // The type and position of a filter is constant, so we can look outside of currentFilters
  [selectInitialFilters, (_, index) => index],
  (filters, index) => filters[index]._type
  // Cache Key
)((_, index) => index);

// ================================================================================
// Action Creators
// ================================================================================
export function fetchFilters() {
  return (dispatch: Function, getState: Function) => {
    const { sourceId }: { sourceId: ?string } = getState().catalogue;
    dispatch({ type: FETCH_REQUEST, meta: { sourceId } });

    if (sourceId == null) {
      return dispatch({
        type: FETCH_FAILURE,
        errorMessage: "Failed to get the filters.",
        meta: "fetchFilters() sourceId is null"
      });
    }

    return fetch(Server.filters(sourceId))
      .then(handleHTMLError)
      .then(
        json => dispatch({ type: FETCH_SUCCESS, filters: json.content }),
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: "Failed to get the filters for this source",
            meta: { error }
          })
      );
  };
}

export function resetFilters() {
  return (dispatch: Function) => dispatch({ type: RESET_FILTERS });
}

export function updateLastUsedFilters() {
  return (dispatch: Function) => dispatch({ type: UPDATE_LAST_USED_FILTERS });
}

export function updateCurrentFilters(filters: Array<FilterAnyType>) {
  return (dispatch: Function) =>
    dispatch({ type: UPDATE_CURRENT_FILTERS, filters });
}

// ================================================================================
// Action Creators - Individual filter update actions
// ================================================================================
export function updateFilterTextField(index: number, newState: string) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter = selectFilterAtIndex(getState(), index);

    const updatedFilter: FilterSelect = {
      ...currentFilter,
      state: newState
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterSelect(index: number, newState: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter = selectFilterAtIndex(getState(), index);

    const updatedFilter: FilterSelect = {
      ...currentFilter,
      state: newState
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterSort(index: number, selectedIndex: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter = selectFilterAtIndex(getState(), index);

    const isAscending = currentFilter.state.ascending;
    const currentIndex = currentFilter.state.index;

    const newAscendingState =
      currentIndex === selectedIndex ? !isAscending : false;

    const updatedFilter = {
      ...currentFilter,
      state: { index: selectedIndex, ascending: newAscendingState }
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterTristate(index: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter = selectFilterAtIndex(getState(), index);

    const updatedFilter = {
      ...currentFilter,
      state: newTristateState(currentFilter.state)
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterGroup(index: number, nestedIndex: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter = selectFilterAtIndex(getState(), index);

    // Update the state of the nested item
    const nestedTristate = currentFilter.state[nestedIndex];
    const updatedTristate: FilterTristateType = {
      ...nestedTristate,
      state: newTristateState(nestedTristate.state)
    };

    // Update the array of state with the updated item
    const updatedState = [
      ...currentFilter.state.slice(0, nestedIndex),
      updatedTristate,
      ...currentFilter.state.slice(nestedIndex + 1)
    ];

    const updatedFilter = { ...currentFilter, state: updatedState };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

// helper function
function newTristateState(prevState: number): number {
  if (prevState < 2) {
    return prevState + 1;
  }
  return 0;
}
