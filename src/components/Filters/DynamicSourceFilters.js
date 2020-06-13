// @flow
import React, { useState, useEffect, useCallback } from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import FormGroup from "@material-ui/core/FormGroup";
import FilterActions from "components/Filters/FilterActions";
import { makeStyles } from "@material-ui/styles";
import DynamicFilter from "components/Filters/DynamicFilter";
import type { FilterAnyType } from "types/filters";
import produce from "immer";

// FIXME: Weird blue line when clicking the <FormGroup>

type Props = {
  filters: FilterAnyType[],
  onSearchClick: (FilterAnyType[]) => any,
  buttonProps?: Object
};

const useStyles = makeStyles({
  filters: {
    width: 250,
    marginLeft: 16,
    marginRight: 16,
    paddingBottom: 16,
    // Add margin to all children
    "& > *": { marginBottom: 16 }
  }
});

const DynamicSourceFilters = ({
  filters,
  onSearchClick,
  buttonProps = {}
}: Props) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Keep a local copy of the filters that you can edit
  const [filtersCopy, setFiltersCopy] = useState(filters);
  useEffect(() => {
    setFiltersCopy(filters);
  }, [filters]);

  const handleSearchClick = () => {
    onSearchClick(filtersCopy);
    setDrawerOpen(false);
  };

  const handleResetClick = () => {
    setFiltersCopy(filters);
  };

  // memoized to prevent rerenders of the memo'd DynamicFilter component
  // requiring that index is passed with updatedFilter instead of via a higher order function to make memoization possible
  const handleFilterChange = useCallback(
    (index: number, updatedFilter: FilterAnyType) => {
      setFiltersCopy(oldFilters => {
        return produce(oldFilters, draftFilters => {
          // eslint-disable-next-line no-param-reassign
          draftFilters[index] = updatedFilter;
        });
      });
    },
    []
  );

  if (filters.length === 0) {
    return (
      <Button disabled variant="contained" color="primary" {...buttonProps}>
        Filters
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setDrawerOpen(true)}
        {...buttonProps}
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
            onSearchClick={handleSearchClick}
            onResetClick={handleResetClick}
          />

          <FormGroup className={classes.filters}>
            {filtersCopy.map((filter, index) => (
              <DynamicFilter
                // The order of filters is constant, so using index as the key is fine.
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                index={index}
                filter={filter}
                onChange={handleFilterChange}
              />
            ))}
          </FormGroup>
        </div>
      </Drawer>
    </>
  );
};

export default DynamicSourceFilters;
