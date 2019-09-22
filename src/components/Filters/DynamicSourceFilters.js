// @flow
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import FormGroup from "@material-ui/core/FormGroup";
import FilterActions from "components/Filters/FilterActions";
import { makeStyles } from "@material-ui/styles";
import { selectFiltersLength } from "redux-ducks/filters";
import { useSelector } from "react-redux";
import DynamicFilter from "components/Filters/DynamicFilter";
import times from "lodash/times";

// FIXME: Weird blue line when clicking the <FormGroup>

type Props = { sourceId: string, buttonProps?: Object };

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

const DynamicSourceFilters = ({ sourceId, buttonProps = {} }: Props) => {
  const classes = useStyles();

  const filtersLength = useSelector(selectFiltersLength);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearchClick = () => {
    setDrawerOpen(false);
  };

  if (!filtersLength) {
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
            sourceId={sourceId}
            onSearchClick={handleSearchClick}
          />

          <FormGroup className={classes.filters}>
            {times(filtersLength).map((_, index) => (
              // The order of filters is constant, so using index as the key is fine.
              // eslint-disable-next-line react/no-array-index-key
              <DynamicFilter index={index} key={index} />
            ))}
          </FormGroup>
        </div>
      </Drawer>
    </>
  );
};

export default DynamicSourceFilters;
