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
    stroke: "darkgray"
  },
  arrowHead: {
    fill: "none",
    strokeWidth: "2"
  },
  line: {
    strokeWidth: "2px",
    strokeDasharray: "24"
  }
});

const Arrow = ({ startX, startY, endX, endY, className }: Props) => {
  const classes = useStyles();

  if (startX == null || startY == null || endX == null || endY == null) {
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
          refX="9"
          refY="5"
          markerWidth="1"
          markerHeight="1"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10" className={classes.arrowHead} />
        </marker>
      </defs>

      <path
        vectorEffect="non-scaling-stroke"
        d={`M${startX},${startY} L${endX},${endY}`}
        className={classes.line}
        style={{ markerEnd: "url(#arrowHead)" }}
      />
    </svg>
  );
};

export default Arrow;
