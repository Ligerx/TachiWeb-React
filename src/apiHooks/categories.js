// @flow
import useSWR, { mutate } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { Server } from "api";
import type { CategoryType } from "types";
import format from "date-fns/format";
import produce from "immer";
import type { LibraryManga } from "@tachiweb/api-client";
import { useEffect, useMemo } from "react";
import { selectCurrentCategoryId } from "redux-ducks/categories";
import { changeCurrentCategoryId } from "redux-ducks/categories/actionCreators";
import { useLibrary } from "./library";
import { serialPromiseChain } from "./utils";

/**
 * Fetch array of categories. If desired, you can optionally include the default category.
 * By default, the default category is not included.
 *
 * @returns `{ data }` data is the only property returned because I'm manually building the response myself.
 * If included, the default category has a `categoryId = -1` and `order = 0`.
 *
 * MAJOR HACKING HAPPENING HERE. Clean this up if I can get the server to do the heavy lifting instead.
 */
export function useCategories(
  options: { includeDefault: "NO" | "YES" | "IF_NOT_EMPTY" } = {
    includeDefault: "NO"
  }
) {
  const dispatch = useDispatch();

  // Assuming that categories are sorted correctly in the returned data.
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

  // Manually adding the default category if requested.
  // TODO:
  // clean up this hack, ideally by having the server send the default manga ids with categories
  // it would also remove the wire-crossing of the library apiHook file
  // however, if the default ids come in with categories, either I want to manually strip them out to keep separate
  // or I need to make some components ignore the default category
  const { data: libraryMangas } = useLibrary();

  // Using useMemo so that the return value doesn't change every render.
  // This is needed to make things like shallow equality checks and useEffect deps array work correctly.
  //
  // Creating 3 separate useMemo values because the side effect hook below needs to refer to responseWithOptionalDefault
  // to correctly work even though this hook could return 3 different types of values.
  const responseNoDefault = useMemo(() => {
    const value = { data: originalResponse.data };

    if (libraryMangas == null || value.data == null) {
      value.data = undefined;
      return value;
    }

    return value;
  }, [libraryMangas, originalResponse.data]);

  const responseWithDefault = useMemo(() => {
    // The return value from useSWR has a class/object with getters/setters. It is not possible to simply clone it
    // with all properties. Instead I'm just going to manually build the object myself.
    // Currently only including the data property.
    const value = { data: originalResponse.data };

    // Manually overriding the original response to mimick getting default category from the server.
    // This will always include a default category even when categories or library is empty.
    // Changing this logic will require updating consumers of useCategories().
    if (libraryMangas == null || value.data == null) {
      value.data = undefined;
      return value;
    }

    value.data = addDefaultCategory(value.data, libraryMangas);

    return value;
  }, [libraryMangas, originalResponse.data]);

  const responseWithOptionalDefault = useMemo(() => {
    const value = { data: originalResponse.data };

    if (libraryMangas == null || value.data == null) {
      value.data = undefined;
      return value;
    }

    const defaultIds = defaultCategoryMangaIds(value.data, libraryMangas);

    if (defaultIds.length > 0) {
      value.data = addDefaultCategory(value.data, libraryMangas);
    }

    return value;
  }, [libraryMangas, originalResponse.data]);

  // SIDE EFFECT
  // Change currentCategoryId if categories updates and the currentCategoryId does not point to an existing category
  // make sure to account for default category.
  // This must refer to responseWithOptionalDefault to work correctly.
  const currentCategoryId = useSelector(selectCurrentCategoryId);
  useEffect(() => {
    if (libraryMangas == null) return;
    if (responseWithOptionalDefault.data == null) return;

    const currentCategoryExists = responseWithOptionalDefault.data.some(
      category => category.id === currentCategoryId
    );
    if (!currentCategoryExists) {
      // should pull default category if it exists, otherwise the first category. Based on the above
      dispatch(changeCurrentCategoryId(responseWithOptionalDefault.data[0].id));
    }
  }, [
    currentCategoryId,
    dispatch,
    libraryMangas,
    responseWithOptionalDefault.data
  ]);

  if (options.includeDefault === "YES") {
    return responseWithDefault;
  }
  if (options.includeDefault === "IF_NOT_EMPTY") {
    return responseWithOptionalDefault;
  }
  return responseNoDefault;
}

function addDefaultCategory(
  categories: CategoryType[],
  libraryMangas: LibraryManga[]
): CategoryType[] {
  const defaultMangaIds = defaultCategoryMangaIds(categories, libraryMangas);

  const defaultCategory: CategoryType = {
    id: -1,
    manga: defaultMangaIds,
    name: "Default",
    order: 0 // assuming that the categories from the server are starting from 1
  };

  return [defaultCategory, ...categories];
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

  const { data: categories } = useCategories();

  return async (sourceIndex, destinationIndex) => {
    if (categories == null) return;

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

  const { data: categories } = useCategories();

  return async (categorySelections, mangaIds) => {
    if (categories == null) return;

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
  category: CategoryType,
  mangaIds: number[],
  isAdding: boolean
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
