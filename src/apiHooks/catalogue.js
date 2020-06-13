// @flow
import useSWR, { useSWRPages } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type {
  CataloguePageRequest,
  CataloguePage,
  Manga
} from "@tachiweb/api-client";
import type { FilterAnyType } from "types/filters";
import * as React from "react";

/**
 * @param filters Expected to be [] when searching all and on first load for individual catalogue.
 * @param render This is a render prop. Accept the data and return an element.
 */
export function useCataloguePages(
  sourceId: string,
  searchQuery: string,
  filters: FilterAnyType[],
  render: (mangaInfos: Manga[]) => React.Node
) {
  // TODO: Update to new (less crappy) infinite loading API when it comes out
  // Seems like it's just broken and won't update on filter change for whatever reason.
  // https://github.com/vercel/swr/pull/435

  console.error("Top of useCataloguePages");
  console.error(sourceId);
  console.error(searchQuery);
  console.error(filters);

  React.useEffect(() => {
    console.error("==== FILTERS IS CHANGING");
  }, [filters]);
  React.useEffect(() => {
    console.error("== SEARCH QUERY IS CHANGING");
  }, [searchQuery]);
  // TODO: I might have to 'memorize' the render function or something for performance.
  // More investigation is needed to see if there is an over-rendering or performance problem here.

  // https://github.com/vercel/swr/issues/126#issuecomment-558193873
  // Based on this github issue, the pageKey should be a static string and the deps array should
  // be used to trigger a reset. However, to support multiple function calls on the same page, I need
  // some sort of differentiator, so I'm using sourceId.
  // I won't pass in sourceId to the deps array based on the above issue as well.
  return useSWRPages(
    `${Server.catalogue()}-${sourceId}`,
    ({ offset, withSWR }) => {
      const { data: cataloguePayload } = withSWR(
        // The api for useSWRPages requires that you break the rule of hooks
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCatalogue(sourceId, searchQuery, filters, offset ?? 1)
      );

      if (cataloguePayload == null) return null;

      return render(cataloguePayload.mangas);
    },
    // Current page starts from 1, index starts from 0, so next page is index + 2
    ({ data: cataloguePayload }, index) => {
      return cataloguePayload != null && cataloguePayload.hasNextPage
        ? index + 2
        : null;
    },
    [searchQuery, filters]
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
    () => {
      console.error("Inside useCatalogue");
      console.error(sourceId);
      console.error(page);
      console.error(searchQuery.trim());
      console.error(filtersChecked);
      return Server.api().getSourceCatalogue(
        sourceId,
        cataloguePostOptions(page, searchQuery.trim(), filtersChecked)
      );
    },
    // () =>
    //   Server.api().getSourceCatalogue(
    //     sourceId,
    //     cataloguePostOptions(page, searchQuery.trim(), filtersChecked)
    //   ),
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
