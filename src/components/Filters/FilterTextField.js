// @flow
import React, { memo } from "react";
import {
  selectFilterAtIndex,
  updateFilterTextField
} from "redux-ducks/filters";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";

type Props = { index: number };

const FilterTextField = memo(({ index }: Props) => {
  const dispatch = useDispatch();

  const filter = useSelector(state => selectFilterAtIndex(state, index));

  const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
    dispatch(updateFilterTextField(index, event.currentTarget.value));
  };

  return (
    <TextField
      label={filter.name}
      value={filter.state}
      onChange={handleChange}
      key={filter.name}
    />
  );
});

export default FilterTextField;
