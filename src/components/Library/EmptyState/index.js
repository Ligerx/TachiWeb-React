// @flow
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EmptyStateContent from "components/Library/EmptyState/EmptyStateContent";
import Arrow from "components/Library/EmptyState/Arrow";
import { useComponentSize, useWindowSize } from "components/hooks";

// Root should be z-index -1
//    Since I want to stretch the arrow svg container to fit the screen, I can either put it behind
//    the content and make height/width 100%, or I could make the parent 'display: flex'.
//    But the second option is less of a drop in solution.
// Arrow should be z-index -2 and be height/width 100% so that it doesn't push the content around.
const useStyles = makeStyles({
  root: {
    zIndex: -1,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    // position the content, without changing width of children
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  content: {
    // push the content below the header
    marginTop: 64 + 80
  },
  arrow: {
    zIndex: -2,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});

const EmptyState = () => {
  const classes = useStyles();
  const ref = useRef(null);
  const contentRef = useRef(null);
  const { x, y, height } =
    contentRef.current != null
      ? contentRef.current.getBoundingClientRect()
      : {};

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const startX = ((x + 16) / windowWidth) * 100;
  const startY = ((y + height) / windowHeight) * 100;
  // const endX = 16 / 100;
  // const endY = 64 / 100;
  const endX = ((16 + 24) / windowWidth) * 100;
  const endY = ((64 + 24) / windowHeight) * 100;
  // const endX = 0;
  // const endY = 0;

  useEffect(() => {
    console.error("should be rerendering");
    console.error("component rect", x, y, height);
    console.error("window size", windowWidth, windowHeight);
    console.error("startX", startX);
    console.error("startY", startY);
    console.error("endX", endX);
    console.error("endY", endY);
  });

  return (
    <div ref={ref} className={classes.root}>
      <EmptyStateContent ref={contentRef} className={classes.content} />
      <Arrow
        className={classes.arrow}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
      />
    </div>
  );
};

export default EmptyState;
