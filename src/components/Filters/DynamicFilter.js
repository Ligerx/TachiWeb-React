// @flow
/* eslint-disable no-underscore-dangle */
import React, { memo } from "react";
import FilterTextField from "components/Filters/FilterTextField";
import FilterSelect from "components/Filters/FilterSelect";
import FilterSort from "components/Filters/FilterSort";
import FilterTristate from "components/Filters/FilterTristate";
import FilterGroup from "components/Filters/FilterGroup";
import type { FilterAnyType } from "types/filters";

type Props = { filter: FilterAnyType, onChange: FilterAnyType => any };

const DynamicFilter = memo<Props>(({ filter, onChange }: Props) => {
  if (["HEADER", "SEPARATOR", "CHECKBOX"].includes(filter._type)) {
    console.error(`Catalogue filters - ${filter._type} is not implemented.`);
    return null;
  }

  switch (filter._type) {
    case "TEXT":
      return <FilterTextField filter={filter} onChange={onChange} />;

    case "SELECT":
      return <FilterSelect filter={filter} onChange={onChange} />;

    case "SORT":
      return <FilterSort filter={filter} onChange={onChange} />;

    case "TRISTATE":
      return <FilterTristate filter={filter} onChange={onChange} />;

    case "GROUP":
      return <FilterGroup filter={filter} onChange={onChange} />;

    default:
      console.error(
        `Catalogue filters - ${filter._type} is not a recognized filter type.`
      );
      return null;
  }
});

export default DynamicFilter;
