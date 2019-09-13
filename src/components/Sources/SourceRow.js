// @flow
import React from "react";
import { useDispatch } from "react-redux";
import type { Source } from "@tachiweb/api-client";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

type Props = {
  source: Source
};

const SourceRow = ({ source }: Props) => {
  const dispatch = useDispatch();

  // TODO get if this source is hidden or not
  const isHidden = false;

  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={!isHidden} onChange={() => {}} />}
        label={source.name}
      />
    </>
  );
};

export default SourceRow;
