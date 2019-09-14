import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Client } from "api";
import Library from "components/Library";
import MangaInfo from "components/MangaInfo";
import Reader from "components/Reader";
import Catalogue from "components/Catalogues";
import Extensions from "components/Extensions";
import BackupRestore from "components/BackupRestore";
import UrlPrefixContext from "components/UrlPrefixContext";
import Settings, { SETTING_INDEX } from "components/Settings";
import Sources from "components/Sources";

// NOTE: All url params are strings. You have to parse them if you want a different type.

type MangaRouterProps = { match: Object }; // props  passed by react router
const MangaRouter = ({ match }: MangaRouterProps) => {
  // match.path is the url prefix and back url.
  // For example: library, a catalogue, and searching all catalogues use these components
  return (
    <UrlPrefixContext.Provider value={match.path}>
      <Switch>
        <Route
          path={Client.chapter(match.path, ":mangaId", ":chapterId")}
          component={Reader}
        />

        <Route
          path={Client.manga(match.path, ":mangaId")}
          component={MangaInfo}
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

        <Route exact path={Client.catalogues()} component={Catalogue} />

        <Route exact path={Client.cataloguesSearchAll()} component={null} />
        <Route path={Client.cataloguesSearchAll()} component={MangaRouter} />

        <Route exact path={Client.catalogue(":sourceId")} component={null} />
        <Route path={Client.catalogue(":sourceId")} component={MangaRouter} />

        <Route exact path={Client.sources()} component={Sources} />

        <Route exact path={Client.library()} component={Library} />
        <Route path={Client.library()} component={MangaRouter} />

        <Route exact path={Client.extensions()} component={Extensions} />

        <Route exact path={Client.backupRestore()} component={BackupRestore} />

        <Route path={`/settings/:${SETTING_INDEX}*`} component={Settings} />
      </Switch>
    </BrowserRouter>
  </>
);

export default Router;
