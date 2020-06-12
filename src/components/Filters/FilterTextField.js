// @flow
import React, { memo } from "react";
import TextField from "@material-ui/core/TextField";
import type { FilterText } from "types/filters";

type Props = { filter: FilterText, onChange: FilterText => any };

const FilterTextField = memo<Props>(({ filter, onChange }: Props) => {
  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    onChange({ ...filter, state: event.currentTarget.value });
  };

  return (
    <TextField
      label={filter.name}
      value={filter.state}
      onChange={handleChange}
    />
  );
});

export default FilterTextField;
