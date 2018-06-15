// @flow
import * as React from 'react';

type Props = {
  className?: string, // optional
};

/* eslint-disable react/prefer-stateless-function */
// Having a named class allows it to show up in react dev tools
function CenteredHOC(WrappedComponent: React.ComponentType<Props>): React.ComponentType<Props> {
  return class withCenteredHOC extends React.Component<Props> {
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
}

export default CenteredHOC;
