// @flow
import * as React from 'react';

/* eslint-disable react/prefer-stateless-function */
// Having a named class allows it to show up in react dev tools
const CenteredHOC = (WrappedComponent: React.Node) =>
  class withCenteredHOC extends React.Component<{}> {
    render() {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };

export default CenteredHOC;
