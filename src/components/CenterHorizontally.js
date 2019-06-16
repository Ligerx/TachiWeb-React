// @flow
import * as React from "react";

type Props = {
  children: React.Node,
  className: ?string // optional
};

const CenterHorizontally = ({ children, className }: Props) => {
  const centerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start" // children height auto
  };

  return (
    <div style={centerStyle} className={className}>
      {children}
    </div>
  );
};

CenterHorizontally.defaultProps = {
  className: null
};

export default CenterHorizontally;
