// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { CategoriesArray } from "types";
import { FETCH_SUCCESS } from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  categories: CategoriesArray,
  isLoaded: boolean
}>;

export default function categoriesReducer(
  state: State = { categories: [], isLoaded: false },
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectCategories = (state: GlobalState): CategoriesArray =>
  state.categories.categories;

// Not using reselect because this should be a cheap calculation and I doubt it'll cause issues
export const selectCategoriesIsLoaded = (state: GlobalState): boolean =>
  state.categories.isLoaded;
