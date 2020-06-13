// @flow
import { useSWRInfinite } from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { CataloguePageRequest, CataloguePage } from "@tachiweb/api-client";
import type { FilterAnyType } from "types/filters";

export function useCatalogueInfinite(
  sourceId: string,
  searchQuery: string,
  filters?: FilterAnyType[]
) {
  const dispatch = useDispatch();

  // API expects null instead of empty array if there are no filters
  const filtersChecked = filters != null && filters.length > 0 ? filters : null;

  return useSWRInfinite<CataloguePage>(
    // TODO: Seems like the key is only accepting a string right now. Update this to be an array when it gets fixed by SWR.
    // Also filters is an array of objects, so JSON.stringify is the preferable way to convert it to a string
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.hasNextPage) return null;

      return `${index}, ${sourceId}, ${searchQuery}, ${JSON.stringify(
        filtersChecked
      )}, ${Server.catalogue()}`;
    },
    key => {
      // Since the key is currently a string, I need to extract out the index
      // index starts at 0, but pages start from 1
      const index = parseInt(key.split(",")[0], 10);

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

// TODO remove this
export const blah = 0;
