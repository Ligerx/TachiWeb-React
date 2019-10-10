// @flow
import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  // X and Y positions are on a scale of 0 to 100
  startX: ?number,
  startY: ?number,
  endX: ?number,
  endY: ?number,

  className?: Object
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
    strokeWidth: "2px",
    strokeDasharray: "24",
    vectorEffect: "non-scaling-stroke"
  }
});

const Arrow = ({ startX, startY, endX, endY, className }: Props) => {
  const classes = useStyles();

  if (
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
      viewBox="0 0 100 100"
      // preserveAspectRatio is important because otherwise the default 'zooming'
      // behavior causes positions to move around
      preserveAspectRatio="none"
      className={classNames(classes.svg, className)}
    >
      <defs>
        <marker
          id="arrowHead"
          viewBox="0 0 10 10"
          refX="9" // move the tip of the arrow closer to the end of the line
          refY="5" // center the arrow left/right
          markerWidth="1"
          markerHeight="1"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10" className={classes.arrowHead} />
        </marker>
      </defs>

      <path
        // Straight Line
        // d={`M${startX},${startY} L${endX},${endY}`}
        //
        // Quadratic Curve
        // d={`M${startX},${startY} Q${endX},${startY}  ${endX},${endY}`}
        //
        // Quadratic Curve with extra curvature
        d={`M${startX},${startY} Q${0},${startY}  ${endX},${endY}`}
        className={classes.line}
        style={{ markerEnd: "url(#arrowHead)" }}
      />
    </svg>
  );
};

export default Arrow;
