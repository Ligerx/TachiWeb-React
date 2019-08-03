// @flow
import { createSelector } from "reselect";
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
  CHANGE_CURRENT_CATEGORY_ID
} from "./actions";

// ================================================================================
// Reducer
// ================================================================================
type State = $ReadOnly<{
  categories: $ReadOnlyArray<CategoryType>,
  isLoaded: boolean,
  currentCategoryId: ?number // null = default category
}>;

export default function categoriesReducer(
  state: State = { categories: [], isLoaded: false, currentCategoryId: null },
  action: Action
): State {
  switch (action.type) {
    case FETCH_SUCCESS:
      return { ...state, categories: action.categories, isLoaded: true };

    case CREATE_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.newCategory]
      };

    case CHANGE_CURRENT_CATEGORY_ID:
      return { ...state, currentCategoryId: action.categoryId };

    case UPDATE_CATEGORY_NAME_REQUEST: {
      const { categoryId, name } = action;
      const categoryIndex = state.categories.findIndex(
        category => category.id === categoryId
      );
      const updatedCategory = { ...state.categories[categoryIndex], name };

      return {
        ...state,
        categories: [
          ...state.categories.slice(0, categoryIndex),
          updatedCategory,
          ...state.categories.slice(categoryIndex + 1)
        ]
      };
    }

    case DELETE_REQUEST: {
      const { categoryId } = action;
      const categoryIndex = state.categories.findIndex(
        category => category.id === categoryId
      );

      return {
        ...state,
        categories: [
          ...state.categories.slice(0, categoryIndex),
          ...state.categories.slice(categoryIndex + 1)
        ]
      };
    }

    case UPDATE_CATEGORY_MANGA_REQUEST: {
      const { categoryId, mangaToAdd, mangaToRemove } = action;
      const categoryIndex = state.categories.findIndex(
        category => category.id === categoryId
      );

      const updatedCategories = state.categories.map((category, index) => {
        if (index !== categoryIndex) return category;

        let updatedManga;
        updatedManga = category.manga.filter(
          mangaId => !mangaToRemove.includes(mangaId)
        );
        updatedManga = [...updatedManga, ...mangaToAdd];

        return {
          ...category,
          manga: updatedManga
        };
      });

      return {
        ...state,
        categories: updatedCategories
      };
    }

    default:
      return state;
  }
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

// Currently sorting the categories via this selector and not in the reducer.
// This is less efficient but it's easier to maintain because this should be the
// single access point to state.categories.categories.
export const selectCategories = createSelector(
  [state => state.categories.categories],
  (categories): $ReadOnlyArray<CategoryType> =>
    categories.sort((a, b) => a.order - b.order)
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
