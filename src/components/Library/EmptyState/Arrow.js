// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

type Props = {};

const useStyles = makeStyles({});

const EmptyState = ({  }: Props) => {
  const classes = useStyles();
  return <div />;
};

export default EmptyState;
