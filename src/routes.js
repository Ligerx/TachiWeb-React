import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Client } from "api";
import Library from "components/Library";
import MangaInfo from "components/MangaInfo";
import Reader from "components/Reader";
import Catalogue from "components/Catalogue";
import Extensions from "components/Extensions";
import BackupRestore from "components/BackupRestore";
import UrlPrefixContext from "components/UrlPrefixContext";
import Settings, { SETTING_INDEX } from "components/Settings";

// NOTE: All url params are strings. You have to parse them if you want a different type.

// match.path is the url prefix. i.e. '/library' '/catalogue'
type MangaRouterProps = { match: Object }; // react router prop
const MangaRouter = ({ match }: MangaRouterProps) => {
  // TODO: make Reader and MangaInfo consistent by moving MangaInfo backUrl info
  // to using context instead of directly passing it here

  // TODO: possibly also create a context for the MangaInfo defaultTab?

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
        <Route path={`${match.path}/:mangaId/:chapterId`} component={Reader} />

        <Route
          path={`${match.path}/:mangaId`}
          render={props => (
            <MangaInfo {...props} backUrl={backUrl} defaultTab={defaultTab} />
          )}
        />
      </Switch>
    </UrlPrefixContext.Provider>
  );
};

const Router = () => (
  <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Library} />

        <Route exact path="/catalogue" component={Catalogue} />
        <Route path="/catalogue" component={MangaRouter} />

        <Route exact path="/library" component={Library} />
        <Route path="/library" component={MangaRouter} />

        <Route exact path="/extensions" component={Extensions} />

        <Route exact path="/backup_restore" component={BackupRestore} />

        <Route path={`/settings/:${SETTING_INDEX}*`} component={Settings} />
      </Switch>
    </BrowserRouter>
  </>
);

export default Router;
