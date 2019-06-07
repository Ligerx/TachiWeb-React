// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import FormGroup from "@material-ui/core/FormGroup";
import type { FilterAnyType } from "types/filters";
import FilterActions from "components/Filters/FilterActions";
import { filterElements } from "components/Filters/filterUtils";
import { makeStyles } from "@material-ui/styles";
import { fetchCatalogue } from "redux-ducks/catalogue";
import {
  selectCurrentFilters,
  resetFilters,
  updateLastUsedFilters,
  updateCurrentFilters
} from "redux-ducks/filters";
import { useSelector, useDispatch } from "react-redux";

// FIXME: Weird blue line when clicking the <FormGroup>

// FIXME: I think using cloneDeep here is getting really laggy.
//        Even after switching to non-lodash, still laggy.
//        May have to do actual object updates instead.

// Choosing to use a deep copy instead of the standard setState method
// It would be a huge pain to try updating an array of objects (and be less readable)
// https://stackoverflow.com/questions/29537299/react-how-do-i-update-state-item1-on-setstate-with-jsfiddle

const useStyles = makeStyles({
  openButton: {
    marginBottom: 24,
    // Kinda hacking the UI for this together right now (right align)
    // https://stackoverflow.com/questions/6507014/how-to-space-the-children-of-a-div-with-css
    marginLeft: "auto",
    marginRight: 8
  },
  filters: {
    width: 250,
    marginLeft: 16,
    marginRight: 16,
    paddingBottom: 16,
    // Add margin to all children
    "& > *": { marginBottom: 16 }
  }
});

const DynamicSourceFilters = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filters = useSelector(selectCurrentFilters);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleUpdateFilters = (newFilters: Array<FilterAnyType>) => {
    dispatch(updateCurrentFilters(newFilters));
  };

  const handleSearchWithFilters = () => {
    dispatch(updateLastUsedFilters()); // Must come before fetchCatalogue. This is a synchronous function.
    dispatch(fetchCatalogue());
    setDrawerOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        disabled={!filters.length}
        variant="contained"
        color="primary"
        onClick={() => setDrawerOpen(true)}
        className={classes.openButton}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {/* without this div, FilterGroup components screw up, not sure why though */}
        <div>
          <FilterActions
            onResetClick={handleResetFilters}
            onSearchClick={handleSearchWithFilters}
          />
          {filters.length && (
            <FormGroup className={classes.filters}>
              {filterElements(filters, handleUpdateFilters)}
            </FormGroup>
          )}
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default DynamicSourceFilters;
