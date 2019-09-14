import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
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
        <Route path={`${match.path}/:mangaId/:chapterId`} component={Reader} />

        <Route path={`${match.path}/:mangaId`} component={MangaInfo} />
      </Switch>
    </UrlPrefixContext.Provider>
  );
};

const Router = () => (
  <>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Library} />

        <Route exact path="/catalogues" component={Catalogue} />
        <Route path="/catalogues" component={MangaRouter} />

        <Route exact path="/sources" component={Sources} />

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
