// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import { selectCategoriesIsLoaded, selectDefaultCategoryHasManga } from ".";
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

export function changeCurrentCategoryId(
  categoryId: ?number
): ChangeCurrentCategoryIdAction {
  return { type: CHANGE_CURRENT_CATEGORY_ID, categoryId };
}

/**
 * Fetch library first, then fetch categories.
 * This function has a side effect that sets the currentCategoryId. Figuring out which
 * categoryId relies on comparing category mangaIds to library mangaIds.
 */
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

      // SIDE EFFECT - set the category after success
      // Note: This selector relies on comparing category manga with library manga so
      //       library must be loaded first.
      if (categories.length > 0 && !selectDefaultCategoryHasManga(getState())) {
        dispatch(changeCurrentCategoryId(categories[0].id));
      }
      // -----------
    } catch (error) {
      dispatch({
        type: FETCH_FAILURE,
        errorMessage: "Failed to find your library categories.",
        meta: { error }
      });
    }
  };
}
