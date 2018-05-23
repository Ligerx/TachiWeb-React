// @flow
import * as React from 'react';

type Props = {
  coverUrl: ?string,
  className: ?string,
  children?: React.Node,
};

// * backgroundImage
// linear-gradient hack, put a white filter over the background image
const BackgroundImage = ({ coverUrl, className, children }: Props) => (
  <div
    className={className}
    style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${coverUrl ||
        ''})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    }}
  >
    {children}
  </div>
);

BackgroundImage.defaultProps = {
  children: null,
};

export default BackgroundImage;
