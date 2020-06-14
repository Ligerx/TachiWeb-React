// @flow
import useSWR from "swr";
import { useDispatch } from "react-redux";
import { Server } from "api";
import type { FilterAnyType } from "types/filters";
import { fetcherUnpackContent } from "./utils";

// eslint-disable-next-line import/prefer-default-export
export function useFilters(sourceId: string) {
  const dispatch = useDispatch();

  return useSWR<FilterAnyType[]>(
    Server.filters(sourceId),
    fetcherUnpackContent,
    {
      onError(error) {
        dispatch({
          type: "filters/FETCH_FAILURE",
          errorMessage: "Failed to get the filters.",
          meta: { error, sourceId }
        });
      }
    }
  );
}
