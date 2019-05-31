import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import configureStore from "redux-ducks";
import App from "App";
import "index.css";

// NOTE: Hot reloading preserves Redux state, but not local component state.
// https://redux.js.org/recipes/configuring-your-store#hot-reloading

const store = configureStore();

const renderApp = () =>
  render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

// React hot reloading
if (module.hot && process.env.NODE_ENV !== "production") {
  module.hot.accept("./App", renderApp);
}

renderApp();
