// @flow
import { combineReducers } from "redux";
import loading from "./loading";
import error from "./error";
import library from "./library";
import type { LibraryAction } from "./library/actions";
import chapters from "./chapters";
import type { ChaptersAction } from "./chapters/actions";
import pageCounts from "./pageCounts";
import type { PageCountsAction } from "./pageCounts/actions";
import sources from "./sources";
import type { SourcesAction } from "./sources/actions";
import catalogue from "./catalogue";
import filters from "./filters";
import type { FiltersAction } from "./filters/actions";
import mangaInfos from "./mangaInfos";
import type { MangaInfosAction } from "./mangaInfos/actions";
import extensions from "./extensions";
import type { ExtensionsAction } from "./extensions/actions";
import settings from "./settings";
import type { SettingsAction } from "./settings/actions";

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

export type Action =
  | LibraryAction
  | ChaptersAction
  | PageCountsAction
  | SourcesAction
  // | CatalogueAction
  | FiltersAction
  | MangaInfosAction
  | ExtensionsAction
  | SettingsAction;

type GetState = () => GlobalState;
type PromiseAction = Promise<Action>;
// eslint-disable-next-line no-use-before-define
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

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
