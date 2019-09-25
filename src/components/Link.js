// @flow
import * as React from "react";
import { Link as ReactRouterLink } from "react-router-dom";

// React-Router Link requires a non-null prop 'to'.
// However, there are times when you dynamically create Links that might not exist
// e.g. link to next chapter might not exist

// React-Router decided they won't change this behavior ¯\_(ツ)_/¯
// https://github.com/ReactTraining/react-router/issues/2319

// The default fallback tag is <button> because at the time of creating this component, it was
// the most commonly used tag, mostly to work by default with Material-UI components that
// are built on top of <ButtonBase>

// https://reactkungfu.com/2016/11/dynamic-jsx-tags/

type Props = {
  to: ?string,
  fallbackComponent?: string | React.ComponentType<any>
}; // all props except 'fallbackComponent' will be passed to the component

const Link = (
  { to, fallbackComponent = "button", ...otherProps }: Props,
  ref
) => {
  const Component = to == null ? fallbackComponent : ReactRouterLink;
  return <Component ref={ref} to={to} {...otherProps} />;
};

// Forwarding ref so that any Material-UI component wrapping/using this component
// doesn't throw an errors. Function components cannot be given refs without forwardRef.
export default React.forwardRef<Props, any>(Link);
