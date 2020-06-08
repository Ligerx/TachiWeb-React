// @flow
import useSWR, { mutate } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { Server } from "api";
import type { CategoryType } from "types";
import format from "date-fns/format";
import produce from "immer";
import type { LibraryManga } from "@tachiweb/api-client";
import { useEffect } from "react";
import { selectCurrentCategoryId } from "redux-ducks/categories";
import { changeCurrentCategoryId } from "redux-ducks/categories/actionCreators";
import { useLibrary } from "./library";
import { serialPromiseChain } from "./utils";

/**
 * Fetch array of categories, including the default category if it should be shown.
 *
 * Default has a categoryId = -1 and order = 0.
 *
 * @returns `{ data }` only returned because I'm doing some hacky stuff here. Fix later.
 */
export function useCategories() {
  const dispatch = useDispatch();

  // Not sorting the categories. Just assuming they'll be sorted correctly in the returned data.
  const originalResponse = useSWR<CategoryType[]>(
    Server.categories(),
    () => Server.api().getCategories(),
    {
      onError(error) {
        dispatch({
          type: "categories/FETCH_FAILURE",
          errorMessage: "Failed to find your library categories.",
          meta: { error }
        });
      }
    }
  );

  // The return value from useSWR has a class/object with getters/settrs. It is not possible to simply clone it
  // with all properties. Instead I'm just going to manually build the object myself.
  // Currently only including the data property.
  const response = { data: originalResponse.data };

  // Manually adding the default category in if it exists.
  // TODO:
  // clean up this hack, ideally by having the server send the default manga ids with categories
  // it would also remove the wire-crossing of the library apiHook file
  // however, if the default ids come in with categories, either I want to manually strip them out to keep separate
  // or I need to make some components ignore the default category
  const { data: libraryMangas } = useLibrary();

  // Manually overriding the original response to mimick getting default category from the server
  if (libraryMangas == null || response.data == null) {
    response.data = undefined;
  } else {
    const defaultMangaIds = defaultCategoryMangaIds(
      response.data,
      libraryMangas
    );
    const defaultCategory: CategoryType = {
      id: -1,
      manga: defaultMangaIds,
      name: "Default",
      order: 0 // assuming that the categories from the server are starting from 1
    };
    response.data = [defaultCategory, ...response.data];
  }

  // SIDE EFFECT
  // change currentCategoryId if categories updates and the currentCategoryId does not point to an existing category
  // make sure to account for default category
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  useEffect(() => {
    if (libraryMangas == null) return;
    if (response.data == null) return;

    const currentCategoryExists = response.data.some(
      category => category.id === currentCategoryId
    );
    if (!currentCategoryExists) {
      // should pull default category if it exists, otherwise the first category. Based on the above
      dispatch(changeCurrentCategoryId(response.data[0].id));
    }
    // HACK: originalResponse.data instead of response.data since response will be changing on every render right now
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategoryId, dispatch, libraryMangas, originalResponse.data]);

  return response;
}

function defaultCategoryMangaIds(
  categories: CategoryType[],
  libraryMangas: LibraryManga[]
): number[] {
  const libraryMangaIds = libraryMangas.map(
    libraryManga => libraryManga.manga.id
  );

  let mangaNotInACategory = [...libraryMangaIds];

  categories.forEach(category => {
    mangaNotInACategory = mangaNotInACategory.filter(
      mangaId => !category.manga.includes(mangaId)
    );
  });

  return mangaNotInACategory;
}

export function useCreateCategory(): () => Promise<void> {
  const dispatch = useDispatch();

  return async () => {
    const name = `New Category ${format(new Date(), "MM-DD HH:mm:ss")}`;

    try {
      await Server.api().createCategory({ name });
      mutate(Server.categories());
    } catch (error) {
      dispatch({
        type: "categories/CREATE_FAILURE",
        errorMessage: "Failed to create a new category.",
        meta: { error }
      });
    }
  };
}

export function useDeleteCategory(): (categoryId: number) => Promise<void> {
  // TODO: handle changing current tab
  const dispatch = useDispatch();

  return async categoryId => {
    try {
      await Server.api().deleteCategory(categoryId);
      mutate(Server.categories());
    } catch (error) {
      dispatch({
        type: "categories/DELETE_FAILURE",
        errorMessage: "Failed to delete category.",
        meta: { error, categoryId }
      });
    }
  };
}

export function useUpdateCategoryName(): (
  categoryId: number,
  name: string
) => Promise<void> {
  const dispatch = useDispatch();

  return async (categoryId, name) => {
    try {
      // Optimistic update
      mutate(
        Server.categories(),
        produce((draftCategories: CategoryType[]) => {
          const category = draftCategories.find(c => c.id === categoryId);
          if (category != null) {
            category.name = name;
          }
        }),
        false
      );

      await Server.api().editCategory(categoryId, { name });
      mutate(Server.categories());
    } catch (error) {
      dispatch({
        type: "categories/UPDATE_CATEGORY_NAME_FAILURE",
        errorMessage: "Failed to update the category name.",
        meta: { error, categoryId, name }
      });
    }
  };
}

export function useReorderCategory(): (
  sourceIndex: number,
  destinationIndex: number
) => Promise<void> {
  const dispatch = useDispatch();

  // Using the SWR categories hook to get data needed to optimistically update the UI.
  // Unsure if this is the 'correct' way to do this, but it seems to work.
  const { data: categoriesWithDefault } = useCategories();

  return async (sourceIndex, destinationIndex) => {
    if (categoriesWithDefault == null) return;

    // removing default category if it exists because the server doesn't want to see this info
    const categories = categoriesWithDefault.filter(
      category => category.id !== -1
    );

    const reorderedCategories = arrayMove(
      categories,
      sourceIndex,
      destinationIndex
    );

    // Reordering the categorise does not change their order property, so I need to then manually overwriting that based on index
    // category order uses 1-based indexing
    const updatedOrderCategories = reorderedCategories.map(
      (category, index) => ({ ...category, order: index + 1 })
    );

    // This endpoint only accepts id, order, and name. So I need to strip down the request to only these properties.
    const idAndOrderOnlyCategories = updatedOrderCategories.map(category => ({
      id: category.id,
      order: category.order
    }));

    try {
      // Optimistic UI update
      mutate(Server.categories(), updatedOrderCategories, false);

      await Server.api().editCategories(idAndOrderOnlyCategories);
      mutate(Server.categories());
    } catch (error) {
      dispatch({
        type: "categories/REORDER_CATEGORY_FAILURE",
        errorMessage: "Failed to change category order.",
        meta: { error, categories, sourceIndex, destinationIndex }
      });
    }
  };
}

/**
 * returns a new array
 * https://stackoverflow.com/a/6470794
 */
function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const copy = [...arr];

  const element = copy[fromIndex];
  copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, element);

  return copy;
}

export function useUpdateMangasInCategories(): (
  categorySelections: { [categoryId: number]: boolean },
  mangaIds: Array<number>
) => Promise<void> {
  const dispatch = useDispatch();

  // Using the SWR categories hook to get data needed to optimistically update the UI.
  // Unsure if this is the 'correct' way to do this, but it seems to work.
  const { data: categories } = useCategories();

  return async (categorySelections, mangaIds) => {
    // Object.keys returns strings. Converting them back to numbers for consistency.
    const categoryIds = Object.keys(categorySelections).map(string =>
      parseInt(string, 10)
    );

    const editCategoryMangaPromises: (() => Promise<any>)[] = [];

    categoryIds.forEach(categoryId => {
      const category = categories.find(cat => cat.id === categoryId);
      const [mangaToAdd, mangaToRemove] = getMangaToAddOrRemoveFromCategory(
        category,
        mangaIds,
        categorySelections[categoryId]
      );

      if (mangaToAdd.length > 0 || mangaToRemove.length > 0) {
        editCategoryMangaPromises.push(() =>
          Server.api().editCategoryManga(categoryId, {
            add: mangaToAdd,
            remove: mangaToRemove
          })
        );
      }
    });

    try {
      // TODO: Side effect of fixing the selected category
      await serialPromiseChain(editCategoryMangaPromises);
      mutate(Server.categories());
    } catch (error) {
      dispatch({
        type: "categories/UPDATE_CATEGORY_MANGA_FAILURE",
        errorMessage: "Failed to add or remove manga from category.",
        meta: { error, categorySelections, mangaIds, categories }
      });
    }
  };
}

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
