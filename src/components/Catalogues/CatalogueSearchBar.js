// @flow
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "components/Catalogues/SearchBar";
import { selectCatalogueSearchQuery } from "redux-ducks/catalogues";
import { updateSearchQuery } from "redux-ducks/catalogues/actionCreators";

type Props = {
  onSubmit: Function,

  // By default, this component pulls and updates from redux
  // If you pass in a value and onChange, you can use your own state management
  value?: string,
  onChange?: string => any
}; // all other props will be passed down to <SearchBar />

const CatalogueSearchBar = ({
  onSubmit,
  value,
  onChange,
  ...otherProps
}: Props) => {
  const searchQuery = useSelector(selectCatalogueSearchQuery);

  const dispatch = useDispatch();

  const handleChangeSearchQuery = event => {
    if (value != null && onChange != null) {
      onChange(event.target.value);
    } else {
      dispatch(updateSearchQuery(event.target.value));
    }
  };

  return (
    <SearchBar
      value={value != null ? value : searchQuery}
      onChange={handleChangeSearchQuery}
      onSubmit={onSubmit}
      {...otherProps}
    />
  );
};

export default CatalogueSearchBar;
