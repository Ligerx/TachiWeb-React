// @flow
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import type { LibraryFlagsType } from "types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

type Props = {
  flags: LibraryFlagsType,
  setLibraryFlag: Function
};

const useStyles = makeStyles({
  icon: {
    marginRight: 8
  }
});

const sorts = [
  { flagState: "ALPHA", description: "Alphabetically" },
  { flagState: "LAST_READ", description: "Last read" },
  { flagState: "LAST_UPDATED", description: "Last updated" },
  { flagState: "UNREAD", description: "Unread" },
  { flagState: "TOTAL", description: "Total chapters" },
  { flagState: "SOURCE", description: "Source" }
];

const LibrarySort = ({ flags, setLibraryFlag }: Props) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sortType: string) => () => {
    const newSortObj = { ...flags.sort }; // not a deep clone but I think it works immutably

    if (flags.sort.type === sortType) {
      const newDirection =
        flags.sort.direction === "ASCENDING" ? "DESCENDING" : "ASCENDING";
      newSortObj.direction = newDirection;
    } else {
      newSortObj.type = sortType;
      newSortObj.direction = "ASCENDING";
    }

    return setLibraryFlag("sort", newSortObj);
  };

  return (
    <>
      <Tooltip title="Sort">
        <IconButton onClick={handleClick}>
          <Icon>sort_by_alpha</Icon>
        </IconButton>
      </Tooltip>

      {/* getContentAnchorEl must be null to make anchorOrigin work */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {sorts.map(sort => (
          <MenuItem
            key={sort.flagState}
            onClick={handleSortChange(sort.flagState)}
          >
            <>
              <Icon className={classes.icon}>
                {iconValue(
                  flags.sort.type,
                  flags.sort.direction,
                  sort.flagState
                )}
              </Icon>
              <Typography>{sort.description}</Typography>
            </>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// Helper methods
function iconValue(
  currentFlag: string,
  sortDirection: string,
  thisFlag: string
): string {
  if (currentFlag === thisFlag) {
    return sortDirection === "ASCENDING" ? "arrow_upward" : "arrow_downward";
  }
  return "";
}

export default LibrarySort;
