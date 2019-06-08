// @flow
import React, { memo } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import FormGroup from "@material-ui/core/FormGroup";
import ButtonBase from "@material-ui/core/ButtonBase";
import { makeStyles } from "@material-ui/styles";
import { selectFilterAtIndex, updateFilterSort } from "redux-ducks/filters";
import { useSelector, useDispatch } from "react-redux";

// NOTE: This component is unoptimized. A single change will cause the entire list to rerender.
//       However, sorts tend to be short lists, so I'm not going to optimize this for now.

const useStyles = makeStyles({
  item: {
    width: "100%",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  formGroup: {
    width: "100%" // lets the items be full width
  },
  icon: {
    marginRight: 8
  }
});

type Props = { index: number };

const FilterSort = memo(({ index }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const filter = useSelector(state => selectFilterAtIndex(state, index));

  const handleChange = (clickedIndex: number) => () => {
    dispatch(updateFilterSort(index, clickedIndex));
  };

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
        <Typography>{filter.name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <FormGroup className={classes.formGroup}>
          {filter.values.map((value, nestedIndex) => (
            <ButtonBase
              onClick={handleChange(nestedIndex)}
              key={`${filter.name} ${value}`}
              className={classes.item}
            >
              <Icon className={classes.icon}>
                {iconValue(
                  filter.state.index,
                  filter.state.ascending,
                  nestedIndex
                )}
              </Icon>
              <Typography>{value}</Typography>
            </ButtonBase>
          ))}
        </FormGroup>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
});

// Helper methods
function iconValue(
  index: number,
  ascending: boolean,
  nestedIndex: number
): string {
  if (nestedIndex === index) {
    return ascending ? "arrow_upward" : "arrow_downward";
  }
  return "";
}

export default FilterSort;
