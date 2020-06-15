// @flow
import useSWR from "swr";
import type { Source } from "@tachiweb/api-client";
import { Server } from "api";
import { useDispatch } from "react-redux";

/**
 * Returns the standard SWR response return type.
 *
 * This is not sorted, filtered, or manipulated by default.
 * Use the functions in the `sourceUtils.js` file to do so.
 */
export function useSources() {
  const dispatch = useDispatch();

  return useSWR<Source[]>(Server.sources(), () => Server.api().getSources(), {
    onError(error) {
      dispatch({
        type: "sources/FETCH_FAILURE",
        errorMessage: "Failed to load sources.",
        meta: { error }
      });
    }
  });
}

/**
 * `FIXME` [June 5, 2020] The single source endpint seems to be crashing the server. Hacking around it for now.
 */
export function useSource(sourceId: ?string) {
  // const dispatch = useDispatch();

  // return useSWR<Source>(
  //   sourceId != null ? Server.source(sourceId) : null,
  //   fetcher,
  //   {
  //     onError(error) {
  //       dispatch({
  //         type: "sources/FETCH_ONE_FAILURE",
  //         errorMessage: "Failed to load source.",
  //         meta: { error }
  //       });
  //     }
  //   }
  // );

  // Hacking around the broken endpoint
  const response = useSources();

  const { data: sources } = response;

  if (sources == null) {
    return response;
  }
  const source = response.data.find(s => s.id === sourceId);

  return { ...response, data: source };
}
