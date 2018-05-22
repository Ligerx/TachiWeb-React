// @flow
import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

type Props = {
  name: string,
  values: Array<string>,
  index: number,
  state: number,
  onChange: Function,
};

const FilterSelect = ({
  name, values, index, state, onChange,
}: Props) => (
  <FormControl>
    <InputLabel htmlFor={generateId(index)}>{name}</InputLabel>
    <Select value={state} onChange={onChange} inputProps={{ id: generateId(index) }}>
      {values.map((text, valuesIndex) => (
        <MenuItem value={valuesIndex} key={valuesIndex}>
          {text}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

// Helper function
function generateId(index: number): string {
  return `filter-select-${index}`;
}

export default FilterSelect;
