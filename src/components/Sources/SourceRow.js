// @flow
import React from "react";
import { useDispatch } from "react-redux";
import type { Source } from "@tachiweb/api-client";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

type Props = {
  source: Source,
  isEnabled: boolean
};

const SourceRow = ({ source, isEnabled }: Props) => {
  const dispatch = useDispatch();

  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={isEnabled} onChange={() => {}} />}
        label={source.name}
      />
    </>
  );
};

export default SourceRow;
