// @flow
import { Server } from "api";
import type {
  FilterAnyType,
  FilterSelect,
  FilterSort,
  FilterGroup,
  FilterTristate
} from "types/filters";
import type { ThunkAction } from "redux-ducks/reducers";
import { handleHTMLError } from "redux-ducks/utils";
import { selectCatalogueSourceId } from "redux-ducks/catalogue";
import { selectFilterAtIndex } from ".";
import {
  FETCH_REQUEST,
  FETCH_FAILURE,
  FETCH_SUCCESS,
  RESET_FILTERS,
  UPDATE_LAST_USED_FILTERS,
  UPDATE_CURRENT_FILTERS,
  UPDATE_FILTER,
  type ResetFiltersAction,
  type UpdateLastUsedFiltersAction,
  type UpdateCurrentFiltersAction
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
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

export function resetFilters(): ResetFiltersAction {
  return { type: RESET_FILTERS };
}

export function updateLastUsedFilters(): UpdateLastUsedFiltersAction {
  return { type: UPDATE_LAST_USED_FILTERS };
}

export function updateCurrentFilters(
  filters: Array<FilterAnyType>
): UpdateCurrentFiltersAction {
  return { type: UPDATE_CURRENT_FILTERS, filters };
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
    ): any); // forced type refinement

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
