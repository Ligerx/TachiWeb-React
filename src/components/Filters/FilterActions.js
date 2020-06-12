// @flow
import React, { memo } from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles({
  // TODO: Position the controls div so that it's always at the top of the viewport
  //       I tried with position sticky and absolute, but it didn't work as intended
  //       Try again in the future
  controls: {
    paddingTop: 12,
    marginBottom: 8
  },
  actionButtons: {
    marginBottom: 12,
    // Center align and stretch to fit
    display: "flex",
    justifyContent: "space-around",
    "& > *": {
      flexBasis: "40%"
    }
  }
});

type Props = {
  onSearchClick: () => any,
  onResetClick: () => any
};

const FilterActions = memo<Props>(({ onSearchClick, onResetClick }: Props) => {
  const classes = useStyles();

  const handleResetClick = () => {
    onResetClick();
  };

  const handleSearchClick = () => {
    onSearchClick();
  };

  return (
    <div className={classes.controls}>
      <div className={classes.actionButtons}>
        <Button onClick={handleResetClick}>Reset</Button>
        <Button variant="contained" color="primary" onClick={handleSearchClick}>
          Search
        </Button>
      </div>
      <Divider />
    </div>
  );
});

export default FilterActions;
