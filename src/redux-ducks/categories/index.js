// @flow
import { createSelector } from "reselect";
import type { GlobalState, Action } from "redux-ducks/reducers";
import type { CategoryType } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import { selectLibraryMangaIds } from "redux-ducks/library";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
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

    case CHANGE_CURRENT_CATEGORY_ID:
      return { ...state, currentCategoryId: action.categoryId };

    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsCategoriesLoading = createLoadingSelector([FETCH_REQUEST]);

export const selectCategories = (
  state: GlobalState
): $ReadOnlyArray<CategoryType> => state.categories.categories;

export const selectCategoriesIsLoaded = (state: GlobalState): boolean =>
  state.categories.isLoaded;

export const selectCurrentCategoryId = (state: GlobalState): ?number =>
  state.categories.currentCategoryId;

export const selectMangaIdsForCurrentCategory = createSelector(
  [selectCategories, selectCurrentCategoryId],
  (categories, currentCategoryId) => {
    if (currentCategoryId === null) {
      // viewing the default category
    }
  }
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
