import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LibraryContainer from 'containers/LibraryContainer';
import MangaInfoContainer from 'containers/MangaInfoContainer';
import ReaderContainer from 'containers/ReaderContainer';
import CatalogueContainer from 'containers/CatalogueContainer';
import ErrorNotificationsContainer from 'containers/ErrorNotificationsContainer';
import { Client } from 'api';

// NOTE: All url params are strings. You have to parse them if you want a different type.

// FIXME: Including GlobalErrorMessageContainer here because I have to
//        Not idea, refactor out an App component or something.

const Router = () => (
  <React.Fragment>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LibraryContainer} />
        <Route path="/library" component={LibraryContainer} />
        <Route
          path="/catalogue/:mangaId"
          render={props => <MangaInfoContainer {...props} backUrl={Client.catalogue()} />}
        />
        <Route path="/catalogue" component={CatalogueContainer} />
        <Route path="/:mangaId/:chapterId/:page" component={ReaderContainer} />
        <Route
          path="/:mangaId"
          render={props => <MangaInfoContainer {...props} backUrl={Client.library()} />}
        />
      </Switch>
    </BrowserRouter>

    <ErrorNotificationsContainer />
  </React.Fragment>
);

export default Router;
