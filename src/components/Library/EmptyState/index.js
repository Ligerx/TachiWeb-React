// @flow
import React, { useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import EmptyStateContent from "components/Library/EmptyState/EmptyStateContent";
import ArrowToMenu from "components/Library/EmptyState/ArrowToMenu";
import { useBoundingClientRect } from "components/hooks";

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
  const theme = useTheme();

  const ref = useRef(null);
  const contentRef = useRef(null);

  const { x, y, width, height } = useBoundingClientRect(ref);
  const {
    x: contentX,
    y: contentY,
    height: contentHeight
  } = useBoundingClientRect(contentRef);

  // ArrowToMenu relies on values from 0 - 100
  const startX = contentX - x;
  const startY = contentY - y + contentHeight - 56;

  // The toolbar (header) gutters change depending on screen size. This shifts the
  // menu icon position and where the arrow should point to.
  // Adjusting the endX based on Material-UI's responsive styles.
  // https://github.com/mui-org/material-ui/blob/0f968fc5400e0e6bbb6f9296fe1c6a29d0bde0d1/packages/material-ui/src/Toolbar/Toolbar.js#L14
  const isUpSm = useMediaQuery(theme.breakpoints.up("sm"));
  const gutterX = isUpSm ? theme.spacing(3) : theme.spacing(2);
  const halfButtonWidth = 24;

  const endX = gutterX + halfButtonWidth;
  const endY = 0;

  return (
    <div ref={ref} className={classes.root}>
      <EmptyStateContent ref={contentRef} className={classes.content} />
      <ArrowToMenu
        className={classes.arrow}
        width={width}
        height={height}
        startX={startX}
        startY={startY}
        endX={endX}
        endY={endY}
      />
    </div>
  );
};

export default EmptyState;
