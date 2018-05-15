import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import { FormGroup } from 'material-ui/Form';
import FilterTristate from './FilterTristate';

// NOTE: Assuming that GROUP will only contain TRISTATE children

const FilterGroup = ({ name, state, onChange }) => (
  <ExpansionPanel defaultExpanded>
    <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
      <Typography>{name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <FormGroup>
        {state.map((tristate, nestedIndex) => (
          <FilterTristate
            name={tristate.name}
            state={tristate.state}
            onChange={onChange(nestedIndex)}
            key={nestedIndex}
          />
        ))}
      </FormGroup>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

FilterGroup.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.array.isRequired, // array of nested filter options
  onChange: PropTypes.func.isRequired,
};

export default FilterGroup;
