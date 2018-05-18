import React from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import FormGroup from '@material-ui/core/FormGroup';
import ButtonBase from '@material-ui/core/ButtonBase';

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
