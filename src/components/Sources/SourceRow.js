// @flow
import React from "react";
import { useDispatch } from "react-redux";
import type { Source } from "@tachiweb/api-client";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { updateHiddenSources } from "redux-ducks/settings/actionCreators";

type Props = {
  source: Source,
  isEnabled: boolean
};

const SourceRow = ({ source, isEnabled }: Props) => {
  const dispatch = useDispatch();

  const handleChange = event => {
    dispatch(updateHiddenSources(source.id, !event.target.checked));
  };

  return (
    <>
      <FormControlLabel
        control={<Checkbox checked={isEnabled} onChange={handleChange} />}
        label={source.name}
      />
    </>
  );
};

export default SourceRow;
