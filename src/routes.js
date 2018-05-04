import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Library from 'containers/Library';
import MangaInfo from 'containers/MangaInfo';
import Reader from 'containers/Reader';

// TODO: rename routes to make more sense
// e.g. library    /library
//      manga_info /:mangaId/
//      reader     /:mangaId/:chapter/:page

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Library} />
      <Route path="/library" component={Library} />
      <Route path="/manga_info/:mangaId" component={MangaInfo} />
      <Route path="/reader/:mangaId/:chapter/:page" component={Reader} />
    </Switch>
  </BrowserRouter>
);

export default Router;
