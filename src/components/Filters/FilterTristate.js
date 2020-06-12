// @flow
import React, { memo } from "react";
import TristateCheckbox from "components/Filters/TristateCheckbox";
import type { FilterTristate as FilterTristateType } from "types/filters";

type Props = {
  filter: FilterTristateType,
  onChange: FilterTristateType => any
};

const FilterTristate = memo<Props>(({ filter, onChange }: Props) => {
  const handleChange = () => {
    onChange({
      ...filter,
      state: newTristateState(filter.state)
    });
  };

  return (
    <TristateCheckbox
      name={filter.name}
      state={filter.state}
      onChange={handleChange}
    />
  );
});

function newTristateState(prevState: number): number {
  if (prevState < 2) {
    return prevState + 1;
  }
  return 0;
}

export default FilterTristate;
