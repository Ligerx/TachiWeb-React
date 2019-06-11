// @flow
import { Server } from "api";
import { selectCatalogueSourceId, changeSourceId } from "redux-ducks/catalogue";
import { createLoadingSelector } from "redux-ducks/loading";
import { handleHTMLError } from "redux-ducks/utils";
import type { SourceType } from "types";
import type { GlobalState } from "redux-ducks/reducers";

// ================================================================================
// Actions
// ================================================================================
const FETCH_REQUEST = "sources/FETCH_REQUEST";
type FETCH_REQUEST_TYPE = "sources/FETCH_REQUEST";
const FETCH_SUCCESS = "sources/FETCH_SUCCESS";
type FETCH_SUCCESS_TYPE = "sources/FETCH_SUCCESS";
const FETCH_FAILURE = "sources/FETCH_FAILURE";
type FETCH_FAILURE_TYPE = "sources/FETCH_FAILURE";
const FETCH_SOURCES = "sources/FETCH";

type FetchRequestAction = { type: FETCH_REQUEST_TYPE };
type FetchSuccessAction = {
  type: FETCH_SUCCESS_TYPE,
  payload: $ReadOnlyArray<SourceType>
};
type FetchFailureAction = {
  type: FETCH_FAILURE_TYPE,
  errorMessage: string,
  meta: Object
};

// ================================================================================
// Reducers
// ================================================================================
type State = $ReadOnlyArray<SourceType>;
type Action = FetchRequestAction | FetchSuccessAction | FetchFailureAction;

export default function sourcesReducer(
  state: State = [],
  action: Action
): State {
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
export const selectSources = (state: GlobalState): $ReadOnlyArray<SourceType> =>
  state.sources;

// ================================================================================
// Action Creators
// ================================================================================
type GetState = () => State;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

export function fetchSources(): ThunkAction {
  return (dispatch, getState) => {
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
