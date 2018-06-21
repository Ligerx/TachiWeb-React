import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Client } from 'api';
import LibraryContainer from 'containers/LibraryContainer';
import MangaInfoContainer from 'containers/MangaInfoContainer';
import ReaderContainer from 'containers/ReaderContainer';
import CatalogueContainer from 'containers/CatalogueContainer';
import ErrorNotificationsContainer from 'containers/ErrorNotificationsContainer';
import BackupRestore from 'pages/BackupRestore';

// NOTE: All url params are strings. You have to parse them if you want a different type.

// FIXME: Including ErrorNotificationsContainer here because I have to
//        Not idea, refactor out an App component or something.

const Router = () => (
  <React.Fragment>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LibraryContainer} />

        <Route exact path="/backup_restore" component={BackupRestore} />

        <Route exact path="/catalogue" component={CatalogueContainer} />
        <Route
          path="/catalogue/:mangaId/:chapterId/:page"
          render={props => <ReaderContainer {...props} urlPrefix="/catalogue" />}
        />
        <Route
          path="/catalogue/:mangaId"
          render={props => (
            <MangaInfoContainer
              {...props}
              backUrl={Client.catalogue()}
              defaultTab={0}
              urlPrefix="/catalogue"
            />
          )}
        />

        <Route exact path="/library" component={LibraryContainer} />
        <Route
          path="/library/:mangaId/:chapterId/:page"
          render={props => <ReaderContainer {...props} urlPrefix="/library" />}
        />
        <Route
          path="/library/:mangaId"
          render={props => (
            <MangaInfoContainer
              {...props}
              backUrl={Client.library()}
              defaultTab={1}
              urlPrefix="/library"
            />
          )}
        />
      </Switch>
    </BrowserRouter>

    <ErrorNotificationsContainer />
  </React.Fragment>
);

export default Router;
