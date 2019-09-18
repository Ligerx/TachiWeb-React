// @flow
import React, { useRef } from "react";
import debounce from "lodash/debounce";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { selectCatalogueSearchQuery } from "redux-ducks/catalogues";
import {
  updateSearchQuery,
  fetchCatalogue
} from "redux-ducks/catalogues/actionCreators";

// Created this component mostly so the entire page doesn't rerender when only search query changes

type Props = { sourceId: string }; // all other props will be passed down to <TextField />

const CatalogueSearchField = ({ sourceId, ...otherProps }: Props) => {
  const searchQuery = useSelector(selectCatalogueSearchQuery);

  const dispatch = useDispatch();

  // Debouncing the search text
  const debouncedSearch = useRef(
    debounce(() => {
      dispatch(fetchCatalogue(sourceId, { restartSearch: true }));
    }, 500)
  );

  const handleChangeSearchQuery = event => {
    dispatch(updateSearchQuery(event.target.value));
    debouncedSearch.current();
  };

  return (
    <TextField
      variant="outlined"
      label="Search for manga"
      value={searchQuery}
      onChange={handleChangeSearchQuery}
      {...otherProps}
    />
  );
};

export default CatalogueSearchField;
