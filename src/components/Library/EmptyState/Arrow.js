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
  return (
    <svg width="300" height="100">
      <defs>
        <marker
          id="arrow"
          markerWidth="13"
          markerHeight="13"
          refx="2"
          refy="6"
          orient="auto"
        >
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "red" }} />
        </marker>
      </defs>

      <path
        d="M30,150 L100,50"
        style={{
          stroke: "red",
          strokeWidth: "1.25px",
          fill: "none",
          markerEnd: "url(#arrow)"
        }}
      />
      <line
        markerEnd="url(#arrow)"
        x1="100"
        y1="100"
        x2="1"
        y2="1"
        stroke="#800000"
      />
    </svg>
    // <svg width="100%" height="100%">
    //   <defs>
    //     <marker
    //       id="arrowhead"
    //       viewBox="0 0 10 10"
    //       refX="3"
    //       refY="5"
    //       markerWidth="6"
    //       markerHeight="6"
    //       orient="auto"
    //     >
    //       <path d="M 0 0 L 10 5 L 0 10 z" />
    //     </marker>
    //   </defs>
    //   <g fill="none" stroke="black" strokeWidth="2" markerEnd="url(#arrowhead)">
    //     <path id="arrowLeft" />
    //     <path id="arrowRight" />
    //   </g>
    // </svg>
  );
};

export default EmptyState;
