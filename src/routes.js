import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Client } from "api";
import Library from "components/Library";
import MangaInfo from "components/MangaInfo";
import Reader from "components/Reader";
import Catalogues from "components/Catalogues";
import CataloguePage from "components/Catalogues/CataloguePage";
import CataloguesSearchAllPage from "components/Catalogues/CataloguesSearchAllPage";
import Extensions from "components/Extensions";
import BackupRestore from "components/BackupRestore";
import UrlPrefixContext from "components/UrlPrefixContext";
import Settings, { SETTING_INDEX } from "components/Settings";
import Sources from "components/Sources";

// NOTE: All url params are strings. You have to parse them if you want a different type.

type MangaRouterProps = { match: Object }; // props  passed by react router
const MangaRouter = ({ match }: MangaRouterProps) => {
  // match.url is the url prefix and back url.
  // For example: library, a catalogue, and searching all catalogues use these components
  return (
    <UrlPrefixContext.Provider value={match.url}>
      <Switch>
        <Route
          path={Client.chapter(match.url, ":mangaId", ":chapterId")}
          component={Reader}
        />

        <Route
          path={Client.manga(match.url, ":mangaId")}
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

        <Route exact path={Client.catalogues()} component={Catalogues} />

        <Route
          exact
          path={Client.cataloguesSearchAll()}
          component={CataloguesSearchAllPage}
        />
        <Route path={Client.cataloguesSearchAll()} component={MangaRouter} />

        <Route
          exact
          path={Client.catalogue(":sourceId")}
          component={CataloguePage}
        />
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
