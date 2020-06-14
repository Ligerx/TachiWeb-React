// @flow
import type { ThunkAction } from "redux-ducks/reducers";
import { RESET_FILTERS } from "redux-ducks/filters/actions";
import { RESET_CATALOGUES } from "./actions";

// ================================================================================
// Action Creators
// ================================================================================

export function resetCataloguesAndFilters(): ThunkAction {
  return dispatch => {
    dispatch({ type: RESET_FILTERS });
    return dispatch({ type: RESET_CATALOGUES });
  };
}
