import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Router from "./routes";
import "./index.css";

const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router />
    </React.Fragment>
  );
};

export default App;
