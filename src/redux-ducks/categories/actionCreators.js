// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import { selectCategoriesIsLoaded } from ".";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CACHE,
  CHANGE_CURRENT_CATEGORY_ID,
  type ChangeCurrentCategoryIdAction
} from "./actions";

// ================================================================================
// Action Creators
// ================================================================================

export function fetchCategories(): ThunkAction {
  return async (dispatch, getState) => {
    if (selectCategoriesIsLoaded(getState())) {
      dispatch({ type: FETCH_CACHE });
      return;
    }

    dispatch({ type: FETCH_REQUEST });

    try {
      const categories = await Server.api().getCategories();
      dispatch({ type: FETCH_SUCCESS, categories });
    } catch (error) {
      dispatch({
        type: FETCH_FAILURE,
        errorMessage: "Failed to find your library categories.",
        meta: { error }
      });
    }
  };
}

export function changeCurrentCategoryId(
  categoryId: ?number
): ChangeCurrentCategoryIdAction {
  return { type: CHANGE_CURRENT_CATEGORY_ID, categoryId };
}
