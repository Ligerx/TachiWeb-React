// @flow
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "components/Catalogues/SearchBar";
import { selectCatalogueSearchQuery } from "redux-ducks/catalogues";
import { updateSearchQuery } from "redux-ducks/catalogues/actionCreators";

type Props = { sourceId: string, onSubmit: Function, useLocalState?: boolean }; // all other props will be passed down to <SearchBar />

const CatalogueSearchBar = ({
  sourceId,
  onSubmit,
  useLocalState = false,
  ...otherProps
}: Props) => {
  const searchQuery = useSelector(selectCatalogueSearchQuery);
  const [localValue, setLocalValue] = useState("");

  const value = useLocalState ? localValue : searchQuery;

  const dispatch = useDispatch();

  const handleChangeSearchQuery = event => {
    if (useLocalState) {
      setLocalValue(event.target.value);
    } else {
      dispatch(updateSearchQuery(event.target.value));
    }
  };

  return (
    <SearchBar
      value={value}
      onChange={handleChangeSearchQuery}
      onSubmit={onSubmit}
      {...otherProps}
    />
  );
};

export default CatalogueSearchBar;
