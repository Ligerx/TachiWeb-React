// @flow
import * as React from 'react';
import Grid from '@material-ui/core/Grid';

// TODO: tweak defailt maxWidth to something that makes sense (on an average monitor)

// Parent Grid centers the child Grid
// Also constrains child Grid's max width
// https://stackoverflow.com/questions/49251454/grid-container-like-bootstrap-container

// NOTE: Material-ui Grid has a weird limitation where you must add
//       padding or it will overflow.
// https://material-ui.com/layout/grid/#negative-margin

// Based on material-ui's grid breakpoints (max val, not min val)
// https://material-ui.com/customization/default-theme/#default-theme
const breakpoints = {
  xs: 599,
  sm: 959,
  md: 1279,
  lg: 1919,
  xl: 1920,
};

type Props = {
  children: React.Node,
  innerGridClassName?: string, // use this to pass any withStyles className
  spacing?: number,
  maxWidth?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl',
};

const ResponsiveGrid = ({
  innerGridClassName, children, spacing, maxWidth,
}: Props) => {
  const calcMaxWidth = typeof maxWidth === 'string' ? breakpoints[maxWidth] : maxWidth;
  const maxWidthStyle = { maxWidth: calcMaxWidth };

  const padding = Math.max(8, spacing / 2); // at least 8px on each side
  const fixXOverflow = {
    paddingLeft: padding,
    paddingRight: padding,
  };

  return (
    <Grid container justify="center" style={fixXOverflow}>
      <Grid container className={innerGridClassName} spacing={spacing} style={maxWidthStyle}>
        {children}
      </Grid>
    </Grid>
  );
};

ResponsiveGrid.defaultProps = {
  innerGridClassName: '',
  spacing: 16,
  maxWidth: 'md',
};

export default ResponsiveGrid;
