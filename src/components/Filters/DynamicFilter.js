// @flow
import React from "react";
import { selectFilterTypeAtIndex } from "redux-ducks/filters";
import { useSelector } from "react-redux";
import FilterTextField from "components/Filters/FilterTextField";
import FilterSelect from "components/Filters/FilterSelect";
import FilterSort from "components/Filters/FilterSort";
import FilterTristate from "components/Filters/FilterTristate";
import FilterGroup from "components/Filters/FilterGroup";

type Props = { index: number };

const DynamicFilter = ({ index }: Props) => {
  const type = useSelector(state => selectFilterTypeAtIndex(state, index));

  if (["HEADER", "SEPARATOR", "CHECKBOX"].includes(type)) {
    console.error(`Catalogue filters - ${type} is not implemented.`);
  }

  switch (type) {
    case "TEXT":
      return <FilterTextField index={index} key={index} />;

    case "SELECT":
      return <FilterSelect index={index} key={index} />;

    case "SORT":
      return <FilterSort index={index} key={index} />;

    case "TRISTATE":
      return <FilterTristate index={index} key={index} />;

    case "GROUP":
      return <FilterGroup index={index} key={index} />;

    default:
      return null;
  }
};

export default DynamicFilter;
