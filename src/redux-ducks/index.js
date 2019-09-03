// @flow
import { createStore, applyMiddleware, type Store as ReduxStore } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import rootReducer, {
  type GlobalState,
  type Action
} from "redux-ducks/reducers";

// https://redux.js.org/recipes/configuring-your-store#hot-reloading

export default function configureStore() {
  const middlewares = [thunk];
  if (process.env.NODE_ENV === `development`) {
    middlewares.push(logger);
  }

  type Store = ReduxStore<GlobalState, Action>;
  const store: Store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }

  return store;
}
