import React from 'react';
import { FormControl } from '@material-ui/core/Form';
import { InputLabel } from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core/Menu';
import PropTypes from 'prop-types';

const FilterSelect = ({
  name, values, index, state, onChange,
}) => (
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
function generateId(index) {
  return `filter-select-${index}`;
}

FilterSelect.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
  state: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterSelect;
