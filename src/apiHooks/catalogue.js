// @flow
import useSWR, { useSWRPages } from "swr";
import { useDispatch, useSelector } from "react-redux";
import { Server } from "api";
import type {
  CataloguePageRequest,
  CataloguePage,
  Manga
} from "@tachiweb/api-client";
import type { FilterAnyType } from "types/filters";
import { selectLastUsedFilters } from "redux-ducks/filters";
import { selectCatalogueSearchQuery } from "redux-ducks/catalogues";
import * as React from "react";

/**
 * render func should be memoized for performance
 * @param filters Expected to be [] when searching all and on first load for individual catalogue.
 * @param render This is a render prop. Accept the data and return an element.
 */
export function useCataloguePages(
  sourceId: string,
  searchQuery: string,
  filters: FilterAnyType[], // Expected to be [] when searching all and on first load for individual catalogue
  render: (mangaInfos: Manga[]) => React.Node
) {
  // const searchQuery = useSelector(selectCatalogueSearchQuery);

  // // Expected to be [] when searching all and on first load for individual catalogue
  // const lastUsedFilters = useSelector(selectLastUsedFilters);

  // TODO: I might have to 'memorize' the render function or something for performance.
  // More investigation is needed to see if there is an over-rendering or performance problem here.
  return useSWRPages(
    [
      Server.catalogue(),
      sourceId,
      searchQuery,
      filters.toString(),
      "paginating"
    ],
    ({ offset, withSWR }) => {
      const { data: catalogue } = withSWR(
        useCatalogue(sourceId, searchQuery, filters, offset ?? 1)
      );

      if (catalogue == null) return null;

      return render(catalogue.mangas);
    },
    // Current page starts from 1, index starts from 0, so next page is index + 2
    (data, index) => (data != null && data.hasNextPage ? index + 2 : null)
  );
}

/**
 * Intended to be used within useSWRPages for infinite loading.
 */
export function useCatalogue(
  sourceId: string,
  searchQuery: string,
  filters: FilterAnyType[],
  page: number // expects integers starting at 1
) {
  const dispatch = useDispatch();

  // API expects null instead of empty array if there are no filters
  const filtersChecked = filters.length > 0 ? filters : null;

  return useSWR<CataloguePage>(
    [Server.catalogue(), sourceId, page, searchQuery, filters.toString()],
    () =>
      Server.api().getSourceCatalogue(
        sourceId,
        cataloguePostOptions(page, searchQuery.trim(), filtersChecked)
      ),
    {
      onError(error) {
        dispatch({
          type: "catalogues/FETCH_FAILURE",
          errorMessage: "Failed to load catalogue.",
          meta: { error, sourceId, page, searchQuery, filters }
        });
      }
    }
  );
}

function cataloguePostOptions(
  page: number,
  query: string,
  filters: ?(FilterAnyType[])
): CataloguePageRequest {
  const request: CataloguePageRequest = {
    page,
    query
  };

  // filters field cannot exist in request if no filters (even null is not allowed)
  if (filters != null) {
    request.filters = JSON.stringify(filters);
  }

  return request;
}

// TODO remove this
export const blah = 0;
