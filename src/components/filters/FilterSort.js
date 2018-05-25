// @flow
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import FormGroup from '@material-ui/core/FormGroup';
import ButtonBase from '@material-ui/core/ButtonBase';

// NOTE: using name as the key, this shouldn't be a problem

type Props = {
  values: Array<string>,
  name: string,
  state: {
    index: number,
    ascending: boolean,
  },
  onChange: Function,
};

const FilterSort = ({
  values, name, state, onChange,
}: Props) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
      <Typography>{name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <FormGroup>
        {values.map((value, nestedIndex) => (
          <ButtonBase onClick={onChange(nestedIndex)} key={name}>
            <Icon>{iconValue(state.index, state.ascending, nestedIndex)}</Icon>
            <Typography>{value}</Typography>
          </ButtonBase>
        ))}
      </FormGroup>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

// Helper methods
function iconValue(index: number, ascending: boolean, nestedIndex: number): string {
  if (nestedIndex === index) {
    return ascending ? 'arrow_upward' : 'arrow_downward';
  }
  return '';
}

export default FilterSort;
