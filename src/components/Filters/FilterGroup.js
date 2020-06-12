// @flow
import React, { memo } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import FormGroup from "@material-ui/core/FormGroup";
import TristateCheckbox from "components/Filters/TristateCheckbox";
import type {
  FilterGroup as FilterGroupType,
  FilterTristate
} from "types/filters";

// NOTE: This component is unoptimized. A single change will cause the entire list to rerender.
//       The list of tristates this generates does tend to get quite long, but I think it's still
//       reasonably performant. Not going to optimize this for now.

// NOTE: Assuming that GROUP will only contain TRISTATE children
// NOTE: using name as the key, this shouldn't be a problem

type Props = {
  filter: FilterGroupType,
  onChange: FilterGroupType => any
};

const FilterGroup = memo<Props>(({ filter, onChange }: Props) => {
  const handleChange = (clickedIndex: number) => () => {
    // Update the state of the nested item
    const nestedTristate = filter.state[clickedIndex];
    const updatedTristate: FilterTristate = {
      ...nestedTristate,
      state: newTristateState(nestedTristate.state)
    };

    // Update the array of state with the updated item
    const updatedState: Array<FilterTristate> = [
      ...filter.state.slice(0, clickedIndex),
      updatedTristate,
      ...filter.state.slice(clickedIndex + 1)
    ];

    onChange({
      ...filter,
      state: updatedState
    });
  };

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
        <Typography>{filter.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <FormGroup>
          {filter.state.map((tristate, nestedIndex) => (
            <TristateCheckbox
              name={tristate.name}
              state={tristate.state}
              onChange={handleChange(nestedIndex)}
              key={`${filter.name} ${tristate.name}`}
            />
          ))}
        </FormGroup>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
});

function newTristateState(prevState: number): number {
  if (prevState < 2) {
    return prevState + 1;
  }
  return 0;
}

export default FilterGroup;
