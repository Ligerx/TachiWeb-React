// @flow
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { CategoriesArray } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import { FETCH_REQUEST, FETCH_SUCCESS, CHANGE_TAB } from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  categories: CategoriesArray,
  isLoaded: boolean,
  currentTab: number // 0 is the default tab
}>;

export default function categoriesReducer(
  state: State = { categories: [], isLoaded: false, currentTab: 0 },
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return { ...state, categories: action.categories, isLoaded: true };

    case CHANGE_TAB:
      return { ...state, currentTab: action.tabValue };

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsCategoriesLoading = createLoadingSelector([FETCH_REQUEST]);

export const selectCategories = (state: GlobalState): CategoriesArray =>
  state.categories.categories;

export const selectCategoriesIsLoaded = (state: GlobalState): boolean =>
  state.categories.isLoaded;

export const selectCategoryCurrentTab = (state: GlobalState): number =>
  state.categories.currentTab;
