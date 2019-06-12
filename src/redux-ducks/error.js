// @flow

// Based on this great article
// https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6
// weird array explaination
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_values_from_a_regular_expression_match

import type { GlobalState } from "redux-ducks/reducers";
import compact from "lodash/compact";
import some from "lodash/some";
import get from "lodash/get";

type State = $ReadOnly<{ [action: string]: string }>;
type Action = { type: string, errorMessage: string };

export default function errorReducer(state: State = {}, action: Action): State {
  const { type, errorMessage } = action;
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

  // not a *_REQUEST / *_FAILURE actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  return {
    ...state,
    // Store errorMessage
    // e.g. stores errorMessage when receiving GET_TODOS_FAILURE
    //      else clear errorMessage when receiving GET_TODOS_REQUEST
    [requestName]: requestState === "FAILURE" ? errorMessage : ""
  };
}

export const allErrorsSelector = (state: GlobalState): string => {
  // forced type refinement
  const allErrors: Array<string> = (compact(Object.values(state.error)): any);
  return allErrors[0] || "";
};

// 'actions' should be an array of strings. Strings should be action prefixes.
// e.g. ['GET_TODOS'] corresponds to GET_TODOS_REQUEST, _SUCCESS, _FAILURE
export const createErrorMessageSelector = (actions: Array<string>) => (
  state: GlobalState
): string => {
  // returns the first error message for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error

  const allErrors = actions.map(action => state.error[action]);
  const errors = compact(allErrors);

  return errors[0] || "";
};

export const createErrorSelector = (actions: Array<string>) => (
  state: GlobalState
): boolean =>
  // returns true if there are no errors related to the passed in actions
  some(actions, action => get(state, `error.${action}`));
