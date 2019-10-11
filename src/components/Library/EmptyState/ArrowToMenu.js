// @flow
import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  // width and height will set the svg viewBox to be 1-to-1 with the component's pixel size
  // it should be the same as the actual size of this component
  width: ?number,
  height: ?number,

  // X and Y positions can be treated as pixel positions
  startX: ?number,
  startY: ?number,
  endX: ?number,
  endY: ?number,

  className?: string
};

const useStyles = makeStyles({
  svg: {
    stroke: "darkgray",
    fill: "none"
  },
  arrowHead: {
    fill: "none",
    strokeWidth: "2"
  },
  line: {
    strokeWidth: "2",
    strokeDasharray: "24"
  }
});

const ArrowToMenu = ({
  width,
  height,
  startX,
  startY,
  endX,
  endY,
  className
}: Props) => {
  const classes = useStyles();

  if (
    width == null ||
    Number.isNaN(width) ||
    height == null ||
    Number.isNaN(height) ||
    startX == null ||
    Number.isNaN(startX) ||
    startY == null ||
    Number.isNaN(startY) ||
    endX == null ||
    Number.isNaN(endX) ||
    endY == null ||
    Number.isNaN(endY)
  ) {
    return null;
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      className={classNames(classes.svg, className)}
    >
      <defs>
        <marker
          id="arrowHead"
          viewBox="0 0 10 10"
          refX={9} // move the tip of the arrow closer to the end of the line
          refY={5} // center the arrow left/right
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10" className={classes.arrowHead} />
        </marker>
      </defs>

      <path
        // Quadratic Curve with extra curvature
        d={`M${startX},${startY} Q${0},${startY}  ${endX},${endY}`}
        className={classes.line}
        style={{ markerEnd: "url(#arrowHead)" }}
      />
    </svg>
  );
};

export default ArrowToMenu;
