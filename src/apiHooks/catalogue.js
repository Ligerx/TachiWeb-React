// @flow
import { useSWRInfinite } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { CataloguePageRequest, CataloguePage } from "@tachiweb/api-client";
import type { FilterAnyType } from "types/filters";

/**
 * Below is an example of loading statuses you can derive from the returned data.
 *
 * The below loading statuses are pulled and modified from an example on github:
 * https://github.com/vercel/swr/pull/435
 *
 * ```
 * const { data, error, page, setPage } = useCatalogueInfinite(...);
 *
 * const isLoadingInitialData = !data && !error;
 * const isLoadingMore = isLoadingInitialData || (data && typeof data[page - 1] === "undefined");
 * const isReachingEnd = data && data[data.length - 1].hasNextPage === false;
 * const isEmpty = data?.[0]?.mangas.length === 0;
 * ```
 */
// eslint-disable-next-line import/prefer-default-export
export function useCatalogueInfinite(
  sourceId: string,
  searchQuery: string,
  filters?: FilterAnyType[]
) {
  const dispatch = useDispatch();

  // API expects null instead of empty array if there are no filters
  const filtersChecked = filters != null && filters.length > 0 ? filters : null;

  return useSWRInfinite<CataloguePage>(
    (index, previousPageData) => {
      // falsey return value makes SWR not load this page
      if (previousPageData && !previousPageData.hasNextPage) return null;

      return [
        index,
        sourceId,
        searchQuery,
        // Filters may be generated from the URL query string. Because of this, there's no guarantee of shallow
        // equality when re-landing on this page. This forces te page to refetch instead of rely on cache when using browser back.
        // By stringifying the filters, you can kind of mimick shallow equality by doing string comparison instead.
        JSON.stringify(filtersChecked),
        Server.catalogue()
      ];
    },
    // The first func passes down all the returned array values as separate parameters instead of an array.
    index => {
      return Server.api().getSourceCatalogue(
        sourceId,
        cataloguePostOptions(index + 1, searchQuery, filtersChecked)
      );
    },
    {
      onError(error) {
        dispatch({
          type: "catalogues/FETCH_FAILURE",
          errorMessage: "Failed to load catalogue.",
          meta: { error, sourceId, searchQuery, filters }
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
    query: query.trim()
  };

  // filters field cannot exist in request if no filters (even null is not allowed)
  if (filters != null) {
    request.filters = JSON.stringify(filters);
  }

  return request;
}
