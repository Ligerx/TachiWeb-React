// @flow
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import type { MangaFlags } from "@tachiweb/api-client";

// A disabled MenuItem will not fire it's onClick event.

// Placing the click events on MenuItem component so that the entire
// element is clickable, not just the checkbox + label.
// However, the click would propagate to the FormControlLabel and trigger a double event,
// effectively undoing the click. I'm using event.preventDefault() to avoid this.

type Props = {
  flags: MangaFlags,
  onReadFilterChange: Function,
  onDownloadedFilterChange: Function
};

const MangaInfoFilter = ({
  flags,
  onReadFilterChange,
  onDownloadedFilterChange
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRemoveFilters = () => {
    onReadFilterChange("SHOW_ALL");
    onDownloadedFilterChange("SHOW_ALL");

    setAnchorEl(null); // Also close the menu
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReadClick = (e: SyntheticEvent<>) => {
    e.preventDefault();
    const newReadFlag =
      flags.readFilter === "SHOW_ALL" ? "SHOW_READ" : "SHOW_ALL";
    onReadFilterChange(newReadFlag);
  };

  const handleUnreadClick = (e: SyntheticEvent<>) => {
    e.preventDefault();
    const newReadFlag =
      flags.readFilter === "SHOW_ALL" ? "SHOW_UNREAD" : "SHOW_ALL";
    onReadFilterChange(newReadFlag);
  };

  const handleDownloadedClick = (e: SyntheticEvent<>) => {
    e.preventDefault();
    const newDownloadedFlag =
      flags.downloadedFilter === "SHOW_ALL" ? "SHOW_DOWNLOADED" : "SHOW_ALL";
    onDownloadedFilterChange(newDownloadedFlag);
  };

  const readIsDisabled = flags.readFilter === "SHOW_UNREAD";
  const unreadIsDisabled = flags.readFilter === "SHOW_READ";

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
        <MenuItem onClick={handleReadClick} disabled={readIsDisabled}>
          <FormControlLabel
            label="Read"
            control={<Checkbox checked={flags.readFilter === "SHOW_READ"} />}
          />
        </MenuItem>

        <MenuItem onClick={handleUnreadClick} disabled={unreadIsDisabled}>
          <FormControlLabel
            label="Unread"
            control={<Checkbox checked={flags.readFilter === "SHOW_UNREAD"} />}
          />
        </MenuItem>

        <MenuItem onClick={handleDownloadedClick}>
          <FormControlLabel
            label="Downloaded"
            control={
              <Checkbox
                checked={flags.downloadedFilter === "SHOW_DOWNLOADED"}
              />
            }
          />
        </MenuItem>

        {/* TODO: Bookmarked information is not currently stored by the server */}
        {/*
          <MenuItem onClick={null}>
            <FormControlLabel
              label="Bookmarked"
              control={<Checkbox checked={false} />}
            />
          </MenuItem>
          */}

        <MenuItem onClick={handleRemoveFilters}>Remove Filters</MenuItem>
      </Menu>
    </>
  );
};

export default MangaInfoFilter;
