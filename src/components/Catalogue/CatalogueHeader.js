// @flow
import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import { makeStyles } from "@material-ui/styles";
import MenuDrawer from "components/MenuDrawer";
import { selectSources } from "redux-ducks/sources";
import {
  selectCatalogueSourceId,
  selectCatalogueSearchQuery,
  fetchCatalogue,
  resetCatalogue,
  updateSearchQuery,
  changeSourceId
} from "redux-ducks/catalogue";
import { fetchFilters } from "redux-ducks/filters/actionCreators";

const useStyles = makeStyles({
  catalogueSelect: {
    paddingLeft: 8
  },
  searchInput: {
    flex: 1, // fill remaining width
    marginLeft: 16
  }
});

const CatalogueHeader = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const sources = useSelector(selectSources);
  const searchQuery = useSelector(selectCatalogueSearchQuery);
  const sourceId = useSelector(selectCatalogueSourceId);

  // Debouncing the search text
  const debouncedSearch = useRef(
    debounce(() => {
      dispatch(fetchCatalogue());
    }, 500)
  );
  const handleSearchChange = (event: SyntheticEvent<HTMLInputElement>) => {
    dispatch(updateSearchQuery(event.currentTarget.value));
    debouncedSearch.current();
  };

  const handleSourceChange = (event: SyntheticEvent<HTMLLIElement>) => {
    // NOTE: Using LIElement because that's how my HTML is structured.
    //       Doubt it'll cause problems, but change this or the actual component if needed.
    const newSourceIndex = parseInt(event.currentTarget.dataset.value, 10);
    const newSourceId = sources[newSourceIndex].id;

    dispatch(resetCatalogue());
    dispatch(changeSourceId(newSourceId));
    dispatch(fetchFilters()); // call before fetchCatalogue so filters don't get used between sources
    dispatch(fetchCatalogue());
  };

  const sourcesExist = sources && sources.length > 0 && sourceId != null;
  const sourceIndex = sources.findIndex(source => source.id === sourceId);

  return (
    <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
      <Toolbar>
        <MenuDrawer />

        {sourcesExist && (
          <>
            <Select
              value={sourceIndex}
              onChange={handleSourceChange}
              classes={{ select: classes.catalogueSelect }}
            >
              {sources.map((source, index) => (
                <MenuItem value={index} key={source.id}>
                  {source.name}
                </MenuItem>
              ))}
            </Select>

            <Input
              className={classes.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CatalogueHeader;
