import React from 'react';
import { FormControlLabel } from '@material-ui/core/Form';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

// +-------+---------+
// | Index | State   |
// +-------+---------+
// | 0     | IGNORE  |
// | 1     | INCLUDE |
// | 2     | EXCLUDE |
// +-------+---------+

const FilterTristate = ({ name, state, onChange }) => {
  const checked = state === 1;
  const indeterminate = state === 0;

  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={onChange} indeterminate={indeterminate} />}
      label={name}
    />
  );
};

FilterTristate.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterTristate;
