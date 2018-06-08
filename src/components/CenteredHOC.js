// @flow
import * as React from 'react';

/* eslint-disable react/prefer-stateless-function */
// Having a named class allows it to show up in react dev tools
const CenteredHOC = (WrappedComponent: React.Node) =>
  class withCenteredHOC extends React.Component<{ className?: string }> {
    render() {
      const { className, ...otherProps } = this.props;
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }} className={className}>
          <WrappedComponent {...otherProps} />
        </div>
      );
    }
  };

export default CenteredHOC;
