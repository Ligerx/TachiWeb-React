import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LibraryContainer from 'containers/LibraryContainer';
import MangaInfoContainer from 'containers/MangaInfoContainer';
import ReaderContainer from 'containers/ReaderContainer';
import CatalogueContainer from 'containers/CatalogueContainer';

// NOTE: All url params are strings. You have to parse them if you want a different type.

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LibraryContainer} />
      <Route path="/library" component={LibraryContainer} />
      <Route path="/catalogue" component={CatalogueContainer} />
      <Route path="/:mangaId/:chapterId/:page" component={ReaderContainer} />
      <Route path="/:mangaId" component={MangaInfoContainer} />
    </Switch>
  </BrowserRouter>
);

export default Router;
