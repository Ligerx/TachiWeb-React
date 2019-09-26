// @flow
import React, { useState } from "react";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import type { MangaFlags } from "@tachiweb/api-client";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import RadioOptionsDialogue from "components/MangaInfo/RadioOptionsDialogue";

type Props = {
  sourceUrl: ?string,
  flags: MangaFlags,
  onDisplayModeChange: Function,
  onSortTypeChange: Function
};

const displayModes = [
  { flagState: "NAME", label: "Show title" },
  { flagState: "NUMBER", label: "Show chapter number" }
];

const sortingModes = [
  { flagState: "SOURCE", label: "By source" },
  { flagState: "NUMBER", label: "By chapter number" }
];

const MangaInfoMore = ({
  onDisplayModeChange,
  onSortTypeChange,
  sourceUrl,
  flags: { displayMode, sortType }
}: Props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [displayModeOpen, setDisplayModeOpen] = useState(false);
  const [sortTypeOpen, setSortTypeOpen] = useState(false);

  const handleClick = (event: SyntheticEvent<>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisplayModeClick = () => {
    setDisplayModeOpen(true);
    handleClose();
  };

  const handleDisplayModeClose = (value: ?string) => {
    setDisplayModeOpen(false);

    if (value != null) {
      onDisplayModeChange(value);
    }
  };

  const handleSortTypeClick = () => {
    setSortTypeOpen(true);
    handleClose();
  };

  const handleSortTypeClose = (value: ?string) => {
    setSortTypeOpen(false);

    if (value != null) {
      onSortTypeChange(value);
    }
  };

  return (
    <>
      <Tooltip title="More options">
        <IconButton onClick={handleClick}>
          <Icon>more_vert</Icon>
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
        <MenuItem onClick={handleDisplayModeClick}>
          Change Display Mode
        </MenuItem>
        <MenuItem onClick={handleSortTypeClick}>Sorting Mode</MenuItem>
        {/* <MenuItem>Download</MenuItem> */}

        {sourceUrl != null ? (
          <MenuItem component="a" href={sourceUrl} target="_blank">
            <ListItemIcon>
              <Icon>open_in_new</Icon>
            </ListItemIcon>
            <ListItemText primary="Open source website" />
          </MenuItem>
        ) : null}
      </Menu>

      <RadioOptionsDialogue
        title="Choose Display Mode"
        open={displayModeOpen}
        value={displayMode}
        options={displayModes}
        onClose={handleDisplayModeClose}
      />

      <RadioOptionsDialogue
        title="Sorting Mode"
        open={sortTypeOpen}
        value={sortType}
        options={sortingModes}
        onClose={handleSortTypeClose}
      />
    </>
  );
};

export default MangaInfoMore;
