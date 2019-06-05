// @flow
import { Server } from "api";
import type { SourceType } from "types";
import { createLoadingSelector } from "redux-ducks/loading";
import { handleHTMLError } from "redux-ducks/utils";
import { selectCatalogueSourceId, changeSourceId } from "redux-ducks/catalogue";

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = "sources/FETCH_REQUEST";
const FETCH_SUCCESS = "sources/FETCH_SUCCESS";
const FETCH_FAILURE = "sources/FETCH_FAILURE";
export const FETCH_SOURCES = "sources/FETCH";

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnlyArray<SourceType>;

export default function sourcesReducer(state: State = [], action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

// ================================================================================
// Selectors
// ================================================================================

export const selectIsSourcesLoading = createLoadingSelector([FETCH_SOURCES]);
export const selectSources = (state): Array<SourceType> => state.sources;

// ================================================================================
// Action Creators
// ================================================================================
export function fetchSources() {
  return (dispatch: Function, getState: Function) => {
    dispatch({ type: FETCH_REQUEST });

    return fetch(Server.sources())
      .then(handleHTMLError)
      .then(
        json => {
          const sources = json.content;
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
