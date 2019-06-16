// @flow
import { Server } from "api";
import isEmpty from "lodash/isEmpty";
import { selectCatalogueSourceId } from "redux-ducks/catalogue";
import { changeSourceId } from "redux-ducks/catalogue/actionCreators";
import type { ThunkAction } from "redux-ducks/reducers";
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  FETCH_CACHE
} from "./actions";
import { selectSources } from ".";

// ================================================================================
// Action Creators
// ================================================================================
// eslint-disable-next-line import/prefer-default-export
export function fetchSources(): ThunkAction {
  return (dispatch, getState) => {
    if (!isEmpty(selectSources(getState()))) {
      return Promise.resolve().then(dispatch({ type: FETCH_CACHE }));
    }

    dispatch({ type: FETCH_REQUEST });

    return Server.api()
      .getSources()
      .then(
        sources => {
          dispatch({ type: FETCH_SUCCESS, payload: sources });

          // SIDE EFFECT - set the catalogue sourceId on first sources load
          if (!selectCatalogueSourceId(getState()) && !isEmpty(sources)) {
            const firstSource = sources[Object.keys(sources)[0]];
            dispatch(changeSourceId(firstSource.id));
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
