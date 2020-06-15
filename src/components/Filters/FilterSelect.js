// @flow
import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import type { FilterSelect as FilterSelectType } from "types/filters";

// NOTE: Odd obsevations about choosing the key (No errors though)
//
// test is prepended with '.$.$', name is also prepended with '.$.$'
// but oddly enough, when you combine them together, only the first one is prepended with '.$.$'
// e.g. key={`${name} ${text}`} -> key=".$.$Type Any"
//
// I think because MenuItem is so deeply nested in other components (via material-ui)
// it makes passing values behave oddly...

type Props = { filter: FilterSelectType, onChange: FilterSelectType => any };

const FilterSelect = ({ filter, onChange }: Props) => {
  const handleChange = (event: SyntheticEvent<HTMLLIElement>) => {
    // NOTE: LIElement is actually within a select
    const newValue = parseInt(event.currentTarget.dataset.value, 10);
    onChange({ ...filter, state: newValue });
  };

  return (
    <FormControl>
      <InputLabel htmlFor={generateId(filter)}>{filter.name}</InputLabel>
      <Select
        value={filter.state}
        onChange={handleChange}
        inputProps={{ id: generateId(filter) }}
      >
        {filter.values.map((text, valuesIndex) => (
          <MenuItem value={valuesIndex} key={`${filter.name} ${text}`}>
            {text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Helper function
function generateId(filter: FilterSelectType): string {
  return `filter-select-${filter.name}-${filter.values.toString()}`;
}

export default FilterSelect;
