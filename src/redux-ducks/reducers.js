// @flow
import { combineReducers } from "redux";
import loading from "./loading";
import error from "./error";
import settings from "./settings";
import categories from "./categories";
import type { SettingsAction } from "./settings/actions";
import type { CategoriesAction } from "./categories/actions";

const reducers = {
  loading,
  error,
  categories,
  settings
};

// Get the type of the entire redux store by extracting it from the reducers' return types
type Reducers = typeof reducers;
type ExtractReturnType = <V>((any, any) => V) => V;
export type GlobalState = $ObjMap<Reducers, ExtractReturnType>;

type ReduxInitAction = { type: "@@INIT" };
export type Action = ReduxInitAction | SettingsAction | CategoriesAction;

type GetState = () => GlobalState;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

export default combineReducers<Reducers, Action>(reducers);

// NOTE: some Thunks (asynchronous calls) may escape early
//       (e.g. return cached data) instead of returning a promise.
//
// A consequence of this is that you can't call .then() on them safely.
// A workaround is to forcefully return a promise so that any function can use
// .then() regardless of cached data or fetch from the server.
//
// Not every function has had this modification made, only the ones that have caused problems.

// Guides used when adding flow types to redux
// https://flow.org/en/docs/react/redux/
// https://blog.callstack.io/type-checking-react-and-redux-thunk-with-flow-part-2-206ce5f6e705
// https://engineering.wework.com/adventures-in-static-typing-react-redux-flow-oh-my-284c5f74adac#cbfa
// https://github.com/reduxjs/redux/tree/master/examples/todos-flow
// https://github.com/hmeerlo/redux-thunk-flow
