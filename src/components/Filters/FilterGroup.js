// @flow
import React, { memo } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import FormGroup from "@material-ui/core/FormGroup";
import { useSelector, useDispatch } from "react-redux";
import { selectFilterAtIndex, updateFilterGroup } from "redux-ducks/filters";
import TristateCheckbox from "components/Filters/TristateCheckbox";

// NOTE: Assuming that GROUP will only contain TRISTATE children
// NOTE: using name as the key, this shouldn't be a problem

type Props = { index: number };

const FilterGroup = memo(({ index }: Props) => {
  const dispatch = useDispatch();

  const filter = useSelector(state => selectFilterAtIndex(state, index));

  const handleChange = (clickedIndex: number) => () => {
    dispatch(updateFilterGroup(index, clickedIndex));
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

export default FilterGroup;
