import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import "./index.css";
import rootReducer from "./redux-ducks";
import App from "./App";

// Redux
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, logger))
);

// Redux hot reloading
if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./redux-ducks", () => {
    store.replaceReducer(rootReducer);
  });
}

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );

// React hot reloading
if (module.hot && process.env.NODE_ENV !== "production") {
  module.hot.accept("./App", renderApp);
}

renderApp();

// NOTE: this type of hot reload does not preserve state.
// Since I've enabled redux hot reloading, I'm not sure how much of a problem this is.
// https://daveceddia.com/hot-reloading-create-react-app
// https://github.com/facebook/create-react-app/issues/2317

// Additional hot reloading resources (3/25/2019)
// https://duske.me/setting-up-hot-module-replacement-with-create-react-app-and-redux
// https://medium.com/@brianhan/hot-reloading-cra-without-eject-b54af352c642
// https://redux.js.org/recipes/configuring-your-store#hot-reloading
