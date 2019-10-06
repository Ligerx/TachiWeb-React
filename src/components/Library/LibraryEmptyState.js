// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { ReactComponent as EmptyStateSVG } from "./tachiyomi-greyscale-backdrop.svg";

type Props = {};

const LibraryEmptyState = ({  }: Props) => {
  return (
    <>
      <EmptyStateSVG />
    </>
  );
};

export default LibraryEmptyState;
