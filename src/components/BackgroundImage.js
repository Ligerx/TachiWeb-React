import React from 'react';

// * backgroundImage
// linear-gradient hack, put a white filter over the background image
const BackgroundImage = ({ thumbnailUrl, className = '', children }) => (
  <div
    className={className}
    style={{
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${thumbnailUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
    }}
  >
    {children}
  </div>
);

export default BackgroundImage;
