import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Client } from "api";
import LibraryContainer from "containers/LibraryContainer";
import MangaInfoContainer from "containers/MangaInfoContainer";
import ReaderContainer from "containers/ReaderContainer";
import CatalogueContainer from "containers/CatalogueContainer";
import ExtensionsContainer from "containers/ExtensionsContainer";
import BackupRestore from "pages/BackupRestore";
import ErrorNotificationsContainer from "containers/ErrorNotificationsContainer";
import UrlPrefixContext from "components/UrlPrefixContext";
import SettingsContainer from "containers/SettingsContainer";
import { SETTING_INDEX } from "pages/Settings";

// NOTE: All url params are strings. You have to parse them if you want a different type.

// FIXME: Including ErrorNotificationsContainer here because I have to
//        Not idea, refactor out an App component or something.

// match.path is the url prefix. i.e. '/library' '/catalogue'
type MangaRouterProps = { match: Object }; // react router prop
const MangaRouter = ({ match }: MangaRouterProps) => {
  let backUrl = "";
  let defaultTab = 0;

  if (match.path === Client.library()) {
    backUrl = Client.library();
    defaultTab = 1;
  } else if (match.path === Client.catalogue()) {
    backUrl = Client.catalogue();
    defaultTab = 0;
  }

  return (
    <UrlPrefixContext.Provider value={match.path}>
      <Switch>
        <Route
          path={`${match.path}/:mangaId/:chapterId/:page`}
          component={ReaderContainer}
        />

        <Route
          path={`${match.path}/:mangaId`}
          render={props => (
            <MangaInfoContainer
              {...props}
              backUrl={backUrl}
              defaultTab={defaultTab}
            />
          )}
        />
      </Switch>
    </UrlPrefixContext.Provider>
  );
};

const Router = () => (
  <React.Fragment>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LibraryContainer} />

        <Route exact path="/catalogue" component={CatalogueContainer} />
        <Route path="/catalogue" component={MangaRouter} />

        <Route exact path="/library" component={LibraryContainer} />
        <Route path="/library" component={MangaRouter} />

        <Route exact path="/extensions" component={ExtensionsContainer} />

        <Route exact path="/backup_restore" component={BackupRestore} />

        <Route
          path={`/settings/:${SETTING_INDEX}*`}
          component={SettingsContainer}
        />
      </Switch>
    </BrowserRouter>

    <ErrorNotificationsContainer />
  </React.Fragment>
);

export default Router;
