// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import FormGroup from "@material-ui/core/FormGroup";
import FilterActions from "components/Filters/FilterActions";
import { makeStyles } from "@material-ui/styles";
import { fetchCatalogue } from "redux-ducks/catalogue";
import {
  selectCurrentFilters,
  resetFilters,
  updateLastUsedFilters
} from "redux-ducks/filters";
import { useSelector, useDispatch } from "react-redux";
import FilterTextField from "components/Filters/FilterTextField";
import FilterSelect from "components/Filters/FilterSelect";
import FilterSort from "components/Filters/FilterSort";
import FilterTristate from "components/Filters/FilterTristate";
import FilterGroup from "components/Filters/FilterGroup";

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

  const handleSearchWithFilters = () => {
    dispatch(updateLastUsedFilters()); // Must come before fetchCatalogue. This is a synchronous function.
    dispatch(fetchCatalogue());
    setDrawerOpen(false);
  };

  if (!filters.length) {
    return (
      <Button
        disabled
        variant="contained"
        color="primary"
        className={classes.openButton}
      >
        Filters
      </Button>
    );
  }

  return (
    <React.Fragment>
      <Button
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

          <FormGroup className={classes.filters}>
            {filters.map((filter, index) => {
              if (["HEADER", "SEPARATOR", "CHECKBOX"].includes(filter._type)) {
                console.error(
                  `Catalogue filters - ${filter._type} is not implemented.`
                );
              }

              switch (filter._type) {
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
            })}
          </FormGroup>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default DynamicSourceFilters;
