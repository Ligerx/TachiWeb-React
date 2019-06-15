// @flow
import React, { memo } from "react";
import TristateCheckbox from "components/Filters/TristateCheckbox";
import { useSelector, useDispatch } from "react-redux";
import { selectFilterAtIndex } from "redux-ducks/filters";
import { updateFilterTristate } from "redux-ducks/filters/actionCreators";

type Props = { index: number };

const FilterTristate = memo(({ index }: Props) => {
  const dispatch = useDispatch();

  const filter = useSelector(state => selectFilterAtIndex(state, index));

  return (
    <TristateCheckbox
      name={filter.name}
      state={filter.state}
      onChange={() => dispatch(updateFilterTristate(index))}
    />
  );
});

export default FilterTristate;
