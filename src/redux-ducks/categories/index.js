// @flow
/* eslint-disable no-param-reassign */ // immer draft is meant to be mutated
import produce from "immer";
import type { GlobalState, Action } from "redux-ducks/reducers";
import { CHANGE_CURRENT_CATEGORY_ID } from "./actions";

// Using immer here, so mutable state is encouraged

// ================================================================================
// Reducer
// ================================================================================
type State = {
  currentCategoryId: number // -1 = default category
};

export default function categoriesReducer(
  state: State = {
    currentCategoryId: -1
  },
  action: Action
): State {
  return produce(state, draft => {
    switch (action.type) {
      case CHANGE_CURRENT_CATEGORY_ID: {
        draft.currentCategoryId = action.categoryId;
        break;
      }

      default:
        break;
    }
  });
}

// ================================================================================
// Selectors
// ================================================================================

export const selectCurrentCategoryId = (state: GlobalState): ?number =>
  state.categories.currentCategoryId;
