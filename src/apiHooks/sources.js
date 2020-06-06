// @flow
import useSWR from "swr";
import type { Source } from "@tachiweb/api-client";
import { Server } from "api";
import { useDispatch } from "react-redux";

// TODO haven't accounted for all the processing/selectors for sources that exist in redux

// eslint-disable-next-line import/prefer-default-export
export function useSources() {
  const dispatch = useDispatch();

  return useSWR<Source>(Server.sources(), () => Server.api().getSources(), {
    onError(error) {
      dispatch({
        type: "sources/FETCH_FAILURE",
        errorMessage: "Failed to load sources",
        meta: { error }
      });
    }
  });
}
