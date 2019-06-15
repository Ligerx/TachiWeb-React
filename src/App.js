// @flow
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import ErrorNotifications from "components/ErrorNotifications";
import { selectIsSettingsLoaded } from "redux-ducks/settings";
import { fetchSettings } from "redux-ducks/settings/actionCreators";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import Router from "routes";
import "index.css";

// Settings apply to more places than just the Settings page, so we
// load them first. The rest of the app is blocked until settings are loaded.
//
// Note: [Written 5-8-2019]
// The Settings page is still handling its own settings dispatch calls.
// This way it continues to stay self contained and does not rely on an outside
// component to fetch data, as that behavior could change any time.

const App = () => {
  // Block everything until settings are loaded
  const dispatch = useDispatch();
  const isSettingsLoaded = useSelector(selectIsSettingsLoaded);

  useEffect(() => {
    dispatch(fetchSettings());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSettingsLoaded) {
    return <FullScreenLoading />;
  }

  return (
    <>
      <CssBaseline />
      <Router />

      <ErrorNotifications />
    </>
  );
};

export default App;
