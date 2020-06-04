// @flow
import useSWR, { mutate } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { CategoryType } from "types";
import format from "date-fns/format";
import produce from "immer";

// NOTE: For any calls using the Server.api().{call}, I'm sort of hacking around SWR's intended usage pattern.
// I'm manually adding a unique key, then using the api call as the fetcher.
// This is because the api() calls fetch() directly and I don't have access to the url as the key.

function fetcher(url) {
  return fetch(url).then(res => res.json());
}

function fetcherUnpackContent(url) {
  return fetcher(url).then(json => json.content);
}

export type UnreadMap = { [mangaId: number]: number };

export function useUnread() {
  const dispatch = useDispatch();

  return useSWR<UnreadMap>(
    Server.libraryUnread(),
    url => fetcherUnpackContent(url).then(content => unreadArrayToMap(content)),
    {
      onError(error) {
        dispatch({
          type: "library/FETCH_UNREAD_FAILURE",
          errorMessage: "Failed to get unread chapters for your library",
          meta: { error }
        });
      }
    }
  );
}

function unreadArrayToMap(
  unreadArray: { id: number, unread: number }[]
): UnreadMap {
  const newUnread = {};
  unreadArray.forEach(unreadObj => {
    newUnread[unreadObj.id] = unreadObj.unread;
  });
  return newUnread;
}

// Not sorting the categories. Just assuming they'll be sorted initially for now.
export function useCategories() {
  const dispatch = useDispatch();

  return useSWR<CategoryType[]>(
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
        meta: { error }
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
          category.name = name;
        }),
        false
      );

      await Server.api().editCategory(categoryId, { name });
      mutate(Server.categories());
    } catch (error) {
      dispatch({
        type: "categories/UPDATE_CATEGORY_NAME_FAILURE",
        errorMessage: "Failed to update the category name.",
        meta: { error }
      });
    }
  };
}
