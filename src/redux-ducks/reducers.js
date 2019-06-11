// @flow
import { combineReducers } from "redux";
import loading from "./loading";
import error from "./error";
import library from "./library";
import chapters from "./chapters";
import pageCounts from "./pageCounts";
import sources from "./sources";
import catalogue from "./catalogue";
import filters from "./filters";
import mangaInfos from "./mangaInfos";
import extensions from "./extensions";
import settings from "./settings";

const reducers = {
  loading,
  error,
  library,
  chapters,
  pageCounts,
  sources,
  catalogue,
  filters,
  mangaInfos,
  extensions,
  settings
};

// Get the type of the entire redux store by extracting it from the reducers' return types
type Reducers = typeof reducers;
type ExtractReturnType = <V>(() => V) => V;
export type GlobalState = $ObjMap<Reducers, ExtractReturnType>;

export default combineReducers(reducers);

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
