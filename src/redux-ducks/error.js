// Based on this great article
// https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6
// weird array explaination
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_values_from_a_regular_expression_match

export default function errorReducer(state = {}, action = {}) {
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
    [requestName]: requestState === 'FAILURE' ? errorMessage : '',
  };
}

// NOTE: not sure if I actually need to use this, so commenting it out for now
//
// import compact from 'lodash/compact';
//
// export const createErrorMessageSelector = actions => (state) => {
//   // returns the first error messages for actions
//   // * We assume when any request fails on a page that
//   //   requires multiple API calls, we shows the first error

//   const allErrors = actions.map(action => state.error[action]);
//   const errors = compact(allErrors);

//   return errors[0] || '';
// };
