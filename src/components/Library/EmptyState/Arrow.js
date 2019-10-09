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
    stroke: "red",
    strokeWidth: "1.25px",
    fill: "none"
  },
  arrowHead: {
    // fill: "red"
  }
});

const EmptyState = ({ startX, startY, endX, endY, className }: Props) => {
  const classes = useStyles();

  if (startX == null || startY == null || endX == null || endY == null) {
    return null;
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      className={classNames(classes.svg, className)}
    >
      <defs>
        <marker
          id="arrowHead"
          viewBox="0 0 10 10"
          refX="3"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10" className={classes.arrowHead} />
        </marker>
      </defs>

      <path d="M20,80 L10,20" style={{ markerEnd: "url(#arrowHead)" }} />
    </svg>
  );
};

export default EmptyState;
