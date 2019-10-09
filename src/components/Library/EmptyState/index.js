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
    // Need to change position to make z-index work
    // chose absolute because it's straightforward to create an element that fills the viewport
    zIndex: -1,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,

    display: "flex",
    flexDirection: "column"
  },
  content: {}
});

const EmptyState = () => {
  const classes = useStyles();
  const contentRef = useRef(null);
  const ref = useRef(null);

  // const size = useComponentSize(ref);
  // const size2 = useWindowSize();

  // useEffect(() => {
  //   console.error("EmptyState component size", size);
  // }, [size]);
  // useEffect(() => {
  //   console.error("EmptyState window size", size2);
  // }, [size2]);

  return (
    <div ref={ref} className={classes.root}>
      <EmptyStateContent ref={contentRef} />
      {/* <Arrow /> */}
    </div>
  );
};

export default EmptyState;
