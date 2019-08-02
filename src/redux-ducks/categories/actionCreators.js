// @flow
import { Server } from "api";
import type { ThunkAction } from "redux-ducks/reducers";
import format from "date-fns/format";
import {
  selectCategories,
  selectCategoriesIsLoaded,
  selectDefaultCategoryHasManga,
  selectCurrentCategoryId
} from ".";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CACHE,
  CREATE_REQUEST,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  DELETE_REQUEST,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE_CATEGORY_NAME_REQUEST,
  UPDATE_CATEGORY_NAME_SUCCESS,
  UPDATE_CATEGORY_NAME_FAILURE,
  UPDATE_CATEGORY_MANGA_REQUEST,
  UPDATE_CATEGORY_MANGA_SUCCESS,
  UPDATE_CATEGORY_MANGA_FAILURE,
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

export function fetchCategories(): ThunkAction {
  return async (dispatch, getState) => {
    if (selectCategoriesIsLoaded(getState())) {
      dispatch({ type: FETCH_CACHE });
      return;
    }

    dispatch({ type: FETCH_REQUEST });

    try {
      const categories = await Server.api().getCategories();

      // [July 1, 2019]
      // On June 22, 2019, nulldev added a dummy default category to the payload at my request.
      // However, this is actually a bad idea because the front end needs to derive the data on every
      // update regardless. The dummy default category is at best useless and at worst causes bugs.
      // I'm manually removing this data from the payload.
      //
      // If nulldev updates the api to get rid of this dummy default data, then the below code
      // can safely be deleted as well.
      if (categories[0].id === -1) {
        categories.shift();
      }
      // ---------------------------

      dispatch({ type: FETCH_SUCCESS, categories });

      // SIDE EFFECT
      if (!selectDefaultCategoryHasManga(getState())) {
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

export function createCategory(): ThunkAction {
  return async dispatch => {
    dispatch({ type: CREATE_REQUEST });

    const name = `New Category ${format(new Date(), "MM-DD HH:mm:ss")}`;

    try {
      const newCategory = await Server.api().createCategory({ name });
      dispatch({ type: CREATE_SUCCESS, newCategory });
    } catch (error) {
      dispatch({
        type: CREATE_FAILURE,
        errorMessage: "Failed to create a new category.",
        meta: { error }
      });
    }
  };
}

export function deleteCategory(categoryId: number): ThunkAction {
  return async (dispatch, getState) => {
    dispatch({ type: DELETE_REQUEST, categoryId });

    // Change the category being viewed if it was just deleted.
    //
    // NOTE: Material-UI may throw an error because we're deleting the currentCategoryId's
    //       category before we have set a new one.
    //       But that's okay since it makes finding the new currentCategoryId simpler because
    //       getState() will no longer have the deleted category stored.
    const state = getState();
    if (categoryId === selectCurrentCategoryId(state)) {
      const categories = selectCategories(state);

      if (categories.length === 1 || selectDefaultCategoryHasManga(state)) {
        dispatch(changeCurrentCategoryId(null));
      } else {
        dispatch(changeCurrentCategoryId(categories[0].id));
      }
    }

    try {
      await Server.api().deleteCategory(categoryId);
      dispatch({ type: DELETE_SUCCESS });
    } catch (error) {
      dispatch({
        type: DELETE_FAILURE,
        errorMessage: "Failed to delete category.",
        meta: { error }
      });
    }
  };
}

export function updateCategoryName(
  categoryId: number,
  name: string
): ThunkAction {
  return async dispatch => {
    dispatch({ type: UPDATE_CATEGORY_NAME_REQUEST, categoryId, name });

    try {
      await Server.api().editCategory(categoryId, { name });
      dispatch({ type: UPDATE_CATEGORY_NAME_SUCCESS });
    } catch (error) {
      dispatch({
        type: UPDATE_CATEGORY_NAME_FAILURE,
        errorMessage: "Failed to update the category name.",
        meta: { error }
      });
    }
  };
}

function updateCategoryManga(
  categoryId: number,
  mangaToAdd: Array<number>,
  mangaToRemove: Array<number>
): ThunkAction {
  return async dispatch => {
    dispatch({
      type: UPDATE_CATEGORY_MANGA_REQUEST,
      categoryId,
      mangaToAdd,
      mangaToRemove
    });

    try {
      await Server.api().editCategoryManga(categoryId, {
        add: mangaToAdd,
        remove: mangaToRemove
      });
      dispatch({ type: UPDATE_CATEGORY_MANGA_SUCCESS });
    } catch (error) {
      dispatch({
        type: UPDATE_CATEGORY_MANGA_FAILURE,
        errorMessage: "Failed to add orremove manga from category.",
        meta: { error }
      });
    }
  };
}

export function updateMultipleCategoryManga(
  categorySelections: Array<{ categoryId: number, selected: boolean }>,
  mangaIds: Array<number>
): ThunkAction {
  return (dispatch, getState) => {
    const categories = selectCategories(getState());

    categorySelections.forEach(categorySelection => {
      const category = categories[categorySelection.categoryId];

      const [mangaToAdd, mangaToRemove] = getMangaToAddOrRemoveFromCategory(
        category,
        mangaIds,
        categorySelection.selected
      );

      if (mangaToAdd.length > 0 || mangaToRemove.length > 0) {
        dispatch(updateCategoryManga(category.id, mangaToAdd, mangaToRemove));
      }
    });
  };
}
// Helper Function
function getMangaToAddOrRemoveFromCategory(
  category,
  mangaIds,
  isAdding
): [Array<number>, Array<number>] {
  const mangaToAdd = [];
  const mangaToRemove = [];

  mangaIds.forEach(mangaId => {
    const isInCategory = category.manga.includes(mangaId);

    if (isAdding && !isInCategory) {
      mangaToAdd.push(mangaId);
    } else if (!isAdding && isInCategory) {
      mangaToRemove.push(mangaId);
    }
  });

  return [mangaToAdd, mangaToRemove];
}