// @flow
/* eslint-disable no-underscore-dangle */
import React, { memo } from "react";
import FilterTextField from "components/Filters/FilterTextField";
import FilterSelect from "components/Filters/FilterSelect";
import FilterSort from "components/Filters/FilterSort";
import FilterTristate from "components/Filters/FilterTristate";
import FilterGroup from "components/Filters/FilterGroup";
import type { FilterAnyType } from "types/filters";

type Props = {
  index: number,
  filter: FilterAnyType,
  // remember to memoize this function so that memo works as expected
  // passing index as well to make it simpler to memoize onChange
  onChange: (number, FilterAnyType) => any
};

const DynamicFilter = memo<Props>(({ index, filter, onChange }: Props) => {
  const handleChange = (newFilter: FilterAnyType) => {
    onChange(index, newFilter);
  };

  if (["HEADER", "SEPARATOR", "CHECKBOX"].includes(filter._type)) {
    console.error(`Catalogue filters - ${filter._type} is not implemented.`);
    return null;
  }

  switch (filter._type) {
    case "TEXT":
      return <FilterTextField filter={filter} onChange={handleChange} />;

    case "SELECT":
      return <FilterSelect filter={filter} onChange={handleChange} />;

    case "SORT":
      return <FilterSort filter={filter} onChange={handleChange} />;

    case "TRISTATE":
      return <FilterTristate filter={filter} onChange={handleChange} />;

    case "GROUP":
      return <FilterGroup filter={filter} onChange={handleChange} />;

    default:
      console.error(
        `Catalogue filters - ${filter._type} is not a recognized filter type.`
      );
      return null;
  }
});

export default DynamicFilter;
