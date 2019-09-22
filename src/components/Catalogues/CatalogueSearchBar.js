// @flow
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "components/Catalogues/SearchBar";
import { selectCatalogueSearchQuery } from "redux-ducks/catalogues";
import { updateSearchQuery } from "redux-ducks/catalogues/actionCreators";

type Props = {
  // By default, this component pulls and updates from redux catalogues.searchQuery
  // Set useLocalState to true bypass this behavior
  useLocalState?: boolean,

  // You may not have to use the value that onSubmit passes
  // For example, an action creator may pull data from redux instead of using a passed variable
  onSubmit: string => any
}; // all other props will be passed down to <SearchBar />

const CatalogueSearchBar = ({
  useLocalState = false,
  onSubmit,
  ...otherProps
}: Props) => {
  const searchQuery = useSelector(selectCatalogueSearchQuery);
  const [localValue, setLocalValue] = useState("");

  const dispatch = useDispatch();

  const handleChangeSearchQuery = event => {
    if (useLocalState) {
      setLocalValue(event.target.value);
    } else {
      dispatch(updateSearchQuery(event.target.value));
    }
  };

  const handleSubmit = () => {
    onSubmit(useLocalState ? localValue : searchQuery);
  };

  return (
    <SearchBar
      value={useLocalState ? localValue : searchQuery}
      onChange={handleChangeSearchQuery}
      onSubmit={handleSubmit}
      {...otherProps}
    />
  );
};

export default CatalogueSearchBar;
