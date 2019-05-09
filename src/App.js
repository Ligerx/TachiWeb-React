import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import ErrorNotificationsContainer from "containers/ErrorNotificationsContainer";
import Router from "./routes";
import "./index.css";

const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router />

      <ErrorNotificationsContainer />
    </React.Fragment>
  );
};

export default App;
