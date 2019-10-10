// @flow
import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import EmptyStateContent from "components/Library/EmptyState/EmptyStateContent";
import Arrow from "components/Library/EmptyState/Arrow";
import { useComponentSize, useBoundingClientRect } from "components/hooks";

const useStyles = makeStyles({
  root: {
    position: "relative", // allows arrow to position: absolute and set z-index

    // content is an inline-block so we can easily get its size and
    // position without worrying about margin or padding
    //
    // center contant
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // using padding allows the container to fully expand, allowing the arrow to fully expand
    padding: 48,
    paddingTop: 80
  },
  arrow: {
    // Pushing arrow underneath the content
    zIndex: -1,
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
  const { width: componentWidth, height: componentHeight } = useComponentSize(
    ref
  );

  const startX = (x / componentWidth) * 100;
  const startY = ((y + height - 48) / componentHeight) * 100;
  // AppBar left padding is 16px (mobile) or 24px. Half the menu icon width = 24px.
  // approximating a middle ground
  const endX = ((24 + 24) / componentWidth) * 100;
  const endY = 0;

  useEffect(() => {
    console.error("client rect", x, y, height);
    console.error("component size", componentWidth, componentHeight);
    console.error("calculations", startX, startY, endX, endY);
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
