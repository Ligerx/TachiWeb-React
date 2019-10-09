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

const useStyles = makeStyles({});

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
    <div ref={ref}>
      <EmptyStateContent ref={contentRef} />
      <Arrow />
    </div>
  );
};

export default EmptyState;
