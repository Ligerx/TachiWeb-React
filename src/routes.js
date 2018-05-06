import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LibraryContainer from 'containers/LibraryContainer';
import MangaInfo from 'containers/MangaInfo';
import Reader from 'containers/Reader';

// TODO: rename routes to make more sense
// e.g. library    /library
//      manga_info /:mangaId/
//      reader     /:mangaId/:chapter/:page

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LibraryContainer} />
      <Route path="/library" component={LibraryContainer} />
      <Route path="/manga_info/:mangaId" component={MangaInfo} />
      <Route path="/reader/:mangaId/:chapterId/:page" component={Reader} />
    </Switch>
  </BrowserRouter>
);

export default Router;
