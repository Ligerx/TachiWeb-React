// @flow
/* eslint-disable no-param-reassign */ // immer draft is meant to be mutated
import { createSelector } from "reselect";
import produce from "immer";
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { CategoryType } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import { selectLibraryMangaIds } from "redux-ducks/library";
import {
  FETCH_CATEGORIES,
  FETCH_SUCCESS,
  CREATE_SUCCESS,
  DELETE_REQUEST,
  UPDATE_CATEGORY_NAME_REQUEST,
  UPDATE_CATEGORY_MANGA_REQUEST,
  REORDER_CATEGORY_REQUEST,
  CHANGE_CURRENT_CATEGORY_ID
} from "./actions";

// For consistency, ignore the order category.order property.
// state.allIds should be the source of truth.
//
// I'm not removing the category.order property in case we move the category type
// over to the api types which I have no control over.

// Using immer here, so mutable state is encouraged

// ================================================================================
// Reducer
// ================================================================================
type State = {
  byId: { [categoryId: number]: CategoryType },
  allIds: Array<number>, // ordered
  isLoaded: boolean,
  currentCategoryId: ?number // null = default category
};

export default function categoriesReducer(
  state: State = {
    byId: {},
    allIds: [],
    isLoaded: false,
    currentCategoryId: null
  },
  action: Action
): State {
  return produce(state, draft => {
    switch (action.type) {
      case FETCH_SUCCESS: {
        // Sorting just in case
        const sortedCategories = action.categories
          .slice()
          .sort((a, b) => a.order - b.order);

        sortedCategories.forEach(category => {
          draft.byId[category.id] = category;
        });

        draft.allIds = sortedCategories.map(category => category.id);

        draft.isLoaded = true;

        break;
      }

      case CREATE_SUCCESS: {
        const { newCategory } = action;

        draft.byId[newCategory.id] = newCategory;
        draft.allIds.push(newCategory.id);

        break;
      }

      case CHANGE_CURRENT_CATEGORY_ID: {
        draft.currentCategoryId = action.categoryId;
        break;
      }

      case UPDATE_CATEGORY_NAME_REQUEST: {
        const { categoryId, name } = action;

        draft.byId[categoryId].name = name;

        break;
      }

      case DELETE_REQUEST: {
        const { categoryId } = action;

        delete draft.byId[categoryId];
        draft.allIds = draft.allIds.filter(id => id !== categoryId);

        break;
      }

      case UPDATE_CATEGORY_MANGA_REQUEST: {
        const { categoryId, mangaToAdd, mangaToRemove } = action;

        const category = draft.byId[categoryId];

        category.manga = category.manga.filter(
          mangaId => !mangaToRemove.includes(mangaId)
        );

        category.manga.push(...mangaToAdd);

        break;
      }

      case REORDER_CATEGORY_REQUEST: {
        const { sourceIndex, destinationIndex } = action;

        arrayMove(draft.allIds, sourceIndex, destinationIndex);
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

export const selectIsCategoriesLoading = createLoadingSelector([
  FETCH_CATEGORIES
]);

export const selectCategoriesIsLoaded = (state: GlobalState): boolean =>
  state.categories.isLoaded;

export const selectCurrentCategoryId = (state: GlobalState): ?number =>
  state.categories.currentCategoryId;

export const selectCategoryIds = (state: GlobalState): Array<number> =>
  state.categories.allIds;

export const selectCategories = createSelector(
  [state => state.categories.byId, selectCategoryIds],
  (categories, categoryIds): $ReadOnlyArray<CategoryType> =>
    categoryIds.map(id => categories[id])
);

export const selectMangaIdsForDefaultCategory = createSelector(
  [selectCategories, selectLibraryMangaIds],
  (
    categories: $ReadOnlyArray<CategoryType>,
    libraryMangaIds: $ReadOnlyArray<number>
  ) => {
    let mangaNotInACategory = [...libraryMangaIds];

    categories.forEach(category => {
      mangaNotInACategory = mangaNotInACategory.filter(
        mangaId => !category.manga.includes(mangaId)
      );
    });

    return mangaNotInACategory;
  }
);

export const selectDefaultCategoryHasManga = createSelector(
  [selectMangaIdsForDefaultCategory],
  mangaIds => mangaIds.length > 0
);

const noMangaIds = [];
export const selectCategoryMangaIds = createSelector(
  [selectCategories, selectCurrentCategoryId, selectMangaIdsForDefaultCategory],
  (categories, currentCategoryId, mangaIdsForDefaultCategory) => {
    if (currentCategoryId === null) {
      // viewing the default category
      return mangaIdsForDefaultCategory;
    }

    const currentCategory = categories.find(
      category => category.id === currentCategoryId
    );
    return currentCategory ? currentCategory.manga : noMangaIds;
  }
);

// ================================================================================
// Helper functions
// ================================================================================

// warning - mutable function
// https://stackoverflow.com/a/6470794
function arrayMove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
