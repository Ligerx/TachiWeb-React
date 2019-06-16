// @flow
import * as React from "react";

// Use this to share urlPrefix to any children instead of drilling props deep in the component tree
// as of writing this, I only use /library or /catalogue

// https://reactjs.org/docs/context.html
// https://reactjs.org/docs/hooks-reference.html#usecontext

const UrlPrefixContext = React.createContext("");

export default UrlPrefixContext;
