// @flow
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import type { LibraryFlagsType } from "types";

// NOTE: Refer to MangaInfoFilter for more details, components are extremely similar

// TODO: can I create a generic component since they are so similar?

type Props = {
  flags: LibraryFlagsType,
  setLibraryFlag: Function
};

const LibraryFilter = ({ flags, setLibraryFlag }: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterClick = (type: string) => (e: SyntheticEvent<>) => {
    e.preventDefault();
    const newFiltersArray = flags.filters.slice();
    const index = flags.filters.findIndex(filter => filter.type === type);
    newFiltersArray[index].status =
      newFiltersArray[index].status === "ANY" ? "INCLUDE" : "ANY";

    return setLibraryFlag("filters", newFiltersArray);
  };

  const [downloadedFilter, unreadFilter, completedFilter] = flags.filters;

  return (
    <>
      <Tooltip title="Filter">
        <IconButton onClick={handleClick}>
          <Icon>filter_list</Icon>
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
        <MenuItem onClick={handleFilterClick("DOWNLOADED")}>
          <FormControlLabel
            label="Downloaded"
            control={
              <Checkbox checked={downloadedFilter.status === "INCLUDE"} />
            }
          />
        </MenuItem>

        <MenuItem onClick={handleFilterClick("UNREAD")}>
          <FormControlLabel
            label="Unread"
            control={<Checkbox checked={unreadFilter.status === "INCLUDE"} />}
          />
        </MenuItem>

        <MenuItem onClick={handleFilterClick("COMPLETED")}>
          <FormControlLabel
            label="Completed"
            control={
              <Checkbox checked={completedFilter.status === "INCLUDE"} />
            }
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default LibraryFilter;
