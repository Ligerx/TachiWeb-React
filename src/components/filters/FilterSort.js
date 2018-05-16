import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import { FormGroup } from 'material-ui/Form';
import ButtonBase from 'material-ui/ButtonBase';

const FilterSort = ({
  values, name, state, onChange,
}) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
      <Typography>{name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <FormGroup>
        {values.map((value, nestedIndex) => (
          <ButtonBase onClick={onChange(nestedIndex)} key={nestedIndex}>
            <Icon>{iconValue(state, nestedIndex)}</Icon>
            <Typography>{value}</Typography>
          </ButtonBase>
        ))}
      </FormGroup>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

// Helper methods
function iconValue({ index, ascending }, nestedIndex) {
  if (nestedIndex === index) {
    return ascending ? 'arrow_upward' : 'arrow_downward';
  }
  return null;
}

FilterSort.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  state: PropTypes.shape({
    index: PropTypes.number.isRequired,
    ascending: PropTypes.bool.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterSort;
