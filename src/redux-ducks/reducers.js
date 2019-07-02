// @flow
import {
  combineReducers,
  type Store as ReduxStore,
  type Dispatch as ReduxDispatch
} from "redux";
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
import categories from "./categories";
import type { LibraryAction } from "./library/actions";
import type { ChaptersAction } from "./chapters/actions";
import type { PageCountsAction } from "./pageCounts/actions";
import type { SourcesAction } from "./sources/actions";
import type { CatalogueAction } from "./catalogue/actions";
import type { FiltersAction } from "./filters/actions";
import type { MangaInfosAction } from "./mangaInfos/actions";
import type { ExtensionsAction } from "./extensions/actions";
import type { SettingsAction } from "./settings/actions";
import type { CategoriesAction } from "./categories/actions";

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
  settings,
  categories
};

// Get the type of the entire redux store by extracting it from the reducers' return types
type Reducers = typeof reducers;
type ExtractReturnType = <V>((any, any) => V) => V;
export type GlobalState = $ObjMap<Reducers, ExtractReturnType>;

type ReduxInitAction = { type: "@@INIT" };
export type Action =
  | ReduxInitAction
  | LibraryAction
  | ChaptersAction
  | PageCountsAction
  | SourcesAction
  | CatalogueAction
  | FiltersAction
  | MangaInfosAction
  | ExtensionsAction
  | SettingsAction
  | CategoriesAction;

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
