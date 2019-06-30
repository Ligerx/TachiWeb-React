// @flow
import React, { memo } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { selectFilterAtIndex } from "redux-ducks/filters";
import { updateFilterSelect } from "redux-ducks/filters/actionCreators";
import { useSelector, useDispatch } from "react-redux";

// NOTE: Odd obsevations about choosing the key (No errors though)
//
// test is prepended with '.$.$', name is also prepended with '.$.$'
// but oddly enough, when you combine them together, only the first one is prepended with '.$.$'
// e.g. key={`${name} ${text}`} -> key=".$.$Type Any"
//
// I think because MenuItem is so deeply nested in other components (via material-ui)
// it makes passing values behave oddly...

type Props = { index: number };

const FilterSelect = memo<Props>(({ index }: Props) => {
  const dispatch = useDispatch();

  const filter = useSelector(state => selectFilterAtIndex(state, index));

  const handleChange = (event: SyntheticEvent<HTMLLIElement>) => {
    // NOTE: LIElement is actually within a select
    const newValue = parseInt(event.currentTarget.dataset.value, 10);
    dispatch(updateFilterSelect(index, newValue));
  };

  return (
    <FormControl>
      <InputLabel htmlFor={generateId(index)}>{filter.name}</InputLabel>
      <Select
        value={filter.state}
        onChange={handleChange}
        inputProps={{ id: generateId(index) }}
      >
        {filter.values.map((text, valuesIndex) => (
          <MenuItem value={valuesIndex} key={`${filter.name} ${text}`}>
            {text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

// Helper function
function generateId(index: number): string {
  return `filter-select-${index}`;
}

export default FilterSelect;
