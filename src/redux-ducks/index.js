import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import rootReducer from "redux-ducks/reducers";

// https://redux.js.org/recipes/configuring-your-store#hot-reloading

export default function configureStore() {
  const middlewares = [thunk];
  if (process.env.NODE_ENV === `development`) {
    middlewares.push(logger);
  }

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./reducers", () => store.replaceReducer(rootReducer));
  }

  return store;
}
