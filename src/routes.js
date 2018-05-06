import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LibraryContainer from 'containers/LibraryContainer';
import MangaInfoContainer from 'containers/MangaInfoContainer';
import Reader from 'containers/Reader';

// NOTE: All url params are strings. You have to parse them if you want a different type.

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LibraryContainer} />
      <Route path="/library" component={LibraryContainer} />
      <Route path="/:mangaId/:chapterId/:page" component={Reader} />
      <Route path="/:mangaId" component={MangaInfoContainer} />
    </Switch>
  </BrowserRouter>
);

export default Router;
