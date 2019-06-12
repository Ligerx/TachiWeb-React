// @flow
import { Server } from "api";
import type {
  FilterAnyType,
  FilterSelect,
  FilterSort,
  FilterGroup,
  FilterTristate
} from "types/filters";
import type { GlobalState } from "redux-ducks/reducers";
import { handleHTMLError } from "redux-ducks/utils";
import {
  RESET_STATE as RESET_CATALOGUE_STATE,
  selectCatalogueSourceId
} from "redux-ducks/catalogue";
import { createSelector } from "reselect";
import createCachedSelector from "re-reselect";

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = "filters/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "filters/FETCH_REQUEST";
const FETCH_SUCCESS = "filters/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "filters/FETCH_SUCCESS";
const FETCH_FAILURE = "filters/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "filters/FETCH_FAILURE";

type FetchRequestAction = { type: FETCH_REQUEST_TYPE, meta: Object };
type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  filters: Array<FilterAnyType>
};
type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

const RESET_FILTERS = "filters/RESET_FILTERS";
type RESET_FILTERS_TYPE = "filters/RESET_FILTERS";
const UPDATE_LAST_USED_FILTERS = "filters/UPDATE_LAST_USED_FILTERS";
type UPDATE_LAST_USED_FILTERS_TYPE = "filters/UPDATE_LAST_USED_FILTERS";
const UPDATE_CURRENT_FILTERS = "filters/UPDATE_CURRENT_FILTERS";
type UPDATE_CURRENT_FILTERS_TYPE = "filters/UPDATE_CURRENT_FILTERS";

type ResetFiltersAction = { type: RESET_FILTERS_TYPE };
type UpdateLastUsedFiltersAction = {
  type: UPDATE_LAST_USED_FILTERS_TYPE
};
type UpdateCurrentFiltersAction = {
  type: UPDATE_CURRENT_FILTERS_TYPE,
  filters: Array<FilterAnyType>
};

const UPDATE_FILTER = "filters/UPDATE_FILTER";
type UPDATE_FILTER_TYPE = "filters/UPDATE_FILTER";

type UpdateFilterAction = {
  type: UPDATE_FILTER_TYPE,
  filter: FilterAnyType,
  index: number
};

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnly<{
  initialFilters: $ReadOnlyArray<FilterAnyType>,
  lastUsedFilters: $ReadOnlyArray<FilterAnyType>, // use this for the actual search fetches

  // having this in the redux store is going to create a ton of actions being logged
  // the benefit is that any un-searched changes will remain when you leave and return to catalogue
  currentFilters: $ReadOnlyArray<FilterAnyType> // stores changes that haven't been submitted yet
}>;
type Action =
  | FetchRequestAction
  | FetchSuccessAction
  | FetchFailureAction
  | ResetFiltersAction
  | UpdateLastUsedFiltersAction
  | UpdateCurrentFiltersAction
  | UpdateFilterAction;

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

export const selectFiltersLength = createSelector(
  // Optimization
  // The length of filters is constant, so we can look outside of currentFilters
  [selectInitialFilters],
  (filters): number => filters.length
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
type GetState = () => GlobalState;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
// eslint-disable-next-line no-use-before-define
type RegularAction = (dispatch: Dispatch) => any;
type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

export function fetchFilters(): ThunkAction {
  return (dispatch, getState) => {
    const sourceId = selectCatalogueSourceId(getState());
    dispatch({ type: FETCH_REQUEST, meta: { sourceId } });

    if (sourceId == null) {
      return dispatch({
        type: FETCH_FAILURE,
        errorMessage: "Failed to get the filters.",
        meta: { error: "fetchFilters() sourceId is null" }
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

export function resetFilters(): RegularAction {
  return dispatch => dispatch({ type: RESET_FILTERS });
}

export function updateLastUsedFilters(): RegularAction {
  return dispatch => dispatch({ type: UPDATE_LAST_USED_FILTERS });
}

export function updateCurrentFilters(
  filters: Array<FilterAnyType>
): RegularAction {
  return dispatch => dispatch({ type: UPDATE_CURRENT_FILTERS, filters });
}

// ================================================================================
// Action Creators - Individual filter update actions
// ================================================================================
export function updateFilterTextField(index: number, newState: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter: FilterSelect = (selectFilterAtIndex(
      getState(),
      index
    ): any); // forced type refinement

    const updatedFilter: FilterSelect = {
      ...currentFilter,
      state: newState
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterSelect(index: number, newState: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter: FilterSelect = (selectFilterAtIndex(
      getState(),
      index
    ): any); // forced type refinement

    const updatedFilter: FilterSelect = {
      ...currentFilter,
      state: newState
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterSort(index: number, selectedIndex: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter: FilterSort = (selectFilterAtIndex(
      getState(),
      index
    ): any); // forced type refinement

    const isAscending = currentFilter.state.ascending;
    const currentIndex = currentFilter.state.index;

    const newAscendingState =
      currentIndex === selectedIndex ? !isAscending : false;

    const updatedFilter: FilterSort = {
      ...currentFilter,
      state: { index: selectedIndex, ascending: newAscendingState }
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterTristate(index: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter: FilterTristate = (selectFilterAtIndex(
      getState(),
      index
    ): any); // forced type refinement

    const updatedFilter: FilterTristate = {
      ...currentFilter,
      state: newTristateState(currentFilter.state)
    };

    dispatch({ type: UPDATE_FILTER, filter: updatedFilter, index });
  };
}

export function updateFilterGroup(index: number, nestedIndex: number) {
  return (dispatch: Function, getState: Function) => {
    const currentFilter: FilterGroup = (selectFilterAtIndex(
      getState(),
      index
    ): any);

    // Update the state of the nested item
    const nestedTristate = currentFilter.state[nestedIndex];
    const updatedTristate: FilterTristate = {
      ...nestedTristate,
      state: newTristateState(nestedTristate.state)
    };

    // Update the array of state with the updated item
    const updatedState: Array<FilterTristate> = [
      ...currentFilter.state.slice(0, nestedIndex),
      updatedTristate,
      ...currentFilter.state.slice(nestedIndex + 1)
    ];

    const updatedFilter: FilterGroup = {
      ...currentFilter,
      state: updatedState
    };

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
