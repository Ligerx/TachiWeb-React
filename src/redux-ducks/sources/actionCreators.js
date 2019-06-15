// @flow
import { Server } from "api";
import { handleHTMLError } from "redux-ducks/utils";
import { selectCatalogueSourceId } from "redux-ducks/catalogue";
import { changeSourceId } from "redux-ducks/catalogue/actionCreators";
import type { ThunkAction } from "redux-ducks/reducers";
import type { SourceType } from "types";
import { FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE } from "./actions";

// ================================================================================
// Action Creators
// ================================================================================
// eslint-disable-next-line import/prefer-default-export
export function fetchSources(): ThunkAction {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_REQUEST });

    return fetch(Server.sources())
      .then(handleHTMLError)
      .then(
        json => {
          const sources: Array<SourceType> = json.content;
          dispatch({ type: FETCH_SUCCESS, payload: sources });

          // SIDE EFFECT - set the catalogue sourceId on first sources load
          if (!selectCatalogueSourceId(getState()) && sources.length > 0) {
            dispatch(changeSourceId(sources[0].id));
          }
        },
        error =>
          dispatch({
            type: FETCH_FAILURE,
            errorMessage: "Failed to load sources",
            meta: { error }
          })
      );
  };
}
