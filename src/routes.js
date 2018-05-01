import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Library from 'containers/Library';
import MangaInfo from 'containers/MangaInfo';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Library} />
      <Route path="/library" component={Library} />
      <Route path="/manga_info/:mangaId" component={MangaInfo} />
    </Switch>
  </BrowserRouter>
);

export default Router;
