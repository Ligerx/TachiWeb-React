// @flow
import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import CenterHorizontally from "components/CenterHorizontally";

type Props = {
  className: ?string // optional
};

const CenteredLoading = ({ className }: Props) => (
  <CenterHorizontally className={className}>
    <CircularProgress />
  </CenterHorizontally>
);

CenteredLoading.defaultProps = { className: null };

export default CenteredLoading;
