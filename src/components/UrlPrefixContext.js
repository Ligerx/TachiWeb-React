// @flow
import React from 'react';

// Use this to share urlPrefix to any children instead of drilling props deep in the component tree
// as of writing this, I only use /library or /catalogue

// https://reactjs.org/docs/context.html

// Must use UrlPrefixProvider instead of UrlPrefixContext.Provider in router.
// Refer to the github issue below for the reason why this bug happens.
// https://github.com/ReactTraining/react-router/issues/6072

const UrlPrefixContext = React.createContext('');

const UrlPrefixProvider = ({ value, children }) => (
  <UrlPrefixContext.Provider value={value}>{children}</UrlPrefixContext.Provider>
);

const UrlPrefixConsumer = UrlPrefixContext.Consumer;

export { UrlPrefixProvider, UrlPrefixConsumer };
