// @flow
import React, { useEffect } from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import ErrorNotificationsContainer from "containers/ErrorNotificationsContainer";
import { createLoadingSelector } from "redux-ducks/loading";
import {
  FETCH_PREFS,
  FETCH_SCHEMA,
  fetchSettings,
  fetchSettingsSchema
} from "redux-ducks/settings";
import FullScreenLoading from "components/loading/FullScreenLoading";
import Router from "routes";
import "index.css";

// Settings apply to more places than just the Settings page, so we
// load them first. The rest of the app is blocked until settings are loaded.
//
// Note: [Written 5-8-2019]
//       The Settings page is still handling its own settings dispatch calls.
//       This way it continues to stay self contained and does not rely on an outside
//       component to fetch data, as that behavior could change any time.

// //////////////////////////////////////////////////////
//     Settings related Redux stuff                    //
// //////////////////////////////////////////////////////
const settingsAreLoading = createLoadingSelector([FETCH_PREFS, FETCH_SCHEMA]);

type StateToProps = { settingsLoading: boolean };

type DispatchToProps = {
  fetchSettings: Function,
  fetchSettingsSchema: Function
};

const mapStateToProps = state => ({
  settingsLoading: settingsAreLoading(state)
});

const mapDispatchToProps = (dispatch): DispatchToProps => ({
  fetchSettings: () => dispatch(fetchSettings()),
  fetchSettingsSchema: () => dispatch(fetchSettingsSchema())
});

// //////////////////////////////////////////////////////

const App = (props: StateToProps & DispatchToProps) => {
  // //////////////////////////////////////////////////////
  //     Block everything until settings are loaded      //
  // //////////////////////////////////////////////////////
  useEffect(() => {
    props.fetchSettings().then(props.fetchSettingsSchema);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (props.settingsLoading) {
    return <FullScreenLoading />;
  }
  // FIXME: I think the problem here is that I need to know when settings are
  //        LOADED, not when they're LOADING
  //
  //        My guess is that on mount, useEffect hasn't run yet,
  //        so library starts rendering/loading early
  //
  //        Confirmed, useEffect runs after a the first render.

  // //////////////////////////////////////////////////////

  return (
    <React.Fragment>
      <CssBaseline />
      <Router />

      <ErrorNotificationsContainer />
    </React.Fragment>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
