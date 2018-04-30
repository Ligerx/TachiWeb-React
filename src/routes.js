import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Library from 'containers/Library';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Library} />
      <Route path="/library" component={Library} />
    </Switch>
  </BrowserRouter>
);

export default Router;
