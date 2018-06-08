// @flow
import * as React from 'react';

/* eslint-disable react/prefer-stateless-function */
// Having a named class allows it to show up in react dev tools
const CenteredHOC = (WrappedComponent: React.Node) =>
  class withCenteredHOC extends React.Component<{ className?: string }> {
    static defaultProps = {
      className: null,
    };

    render() {
      const { className, ...otherProps } = this.props;

      const centerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // children height auto
      };

      return (
        <div style={centerStyle} className={className}>
          <WrappedComponent {...otherProps} />
        </div>
      );
    }
  };

export default CenteredHOC;
