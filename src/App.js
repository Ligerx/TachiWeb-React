// @flow
import React, { useEffect } from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import ErrorNotificationsContainer from "containers/ErrorNotificationsContainer";
import { fetchSettings, fetchSettingsSchema } from "redux-ducks/settings";
import FullScreenLoading from "components/loading/FullScreenLoading";
import Router from "routes";
import "index.css";

// Settings apply to more places than just the Settings page, so we
// load them first. The rest of the app is blocked until settings are loaded.
//
// Note: [Written 5-8-2019]
// The Settings page is still handling its own settings dispatch calls.
// This way it continues to stay self contained and does not rely on an outside
// component to fetch data, as that behavior could change any time.

// //////////////////////////////////////////////////////
//     Settings related Redux stuff                    //
// //////////////////////////////////////////////////////
type StateToProps = { isSettingsLoaded: boolean };

type DispatchToProps = {
  fetchSettings: Function,
  fetchSettingsSchema: Function
};

const mapStateToProps = state => ({
  isSettingsLoaded: state.settings.allPrefsFetched
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

  // eslint-disable-next-line react/destructuring-assignment
  if (!props.isSettingsLoaded) {
    return <FullScreenLoading />;
  }

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
