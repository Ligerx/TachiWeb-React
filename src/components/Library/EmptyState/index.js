// @flow
import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EmptyStateContent from "components/Library/EmptyState/EmptyStateContent";
import Arrow from "components/Library/EmptyState/Arrow";
import { useWindowSize, useBoundingClientRect } from "components/hooks";

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

  const { x, y, height } = useBoundingClientRect(contentRef);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const startX = (x / windowWidth) * 100;
  const startY = ((y + height - 48) / windowHeight) * 100;
  // AppBar left padding is 16px (mobile) or 24px
  // Half the menu icon width = 24px
  const endX = ((24 + 24) / windowWidth) * 100;
  // AppBar with one row height is 56px (mobile) or 64px
  const endY = ((64 + 8) / windowHeight) * 100;

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
