// @flow
import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditCategoriesDialog from "components/Library/EditCategoriesDialog";

const LibraryMore = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editCategoriesIsOpen, setEditCategoriesIsOpen] = useState(false);

  const handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditCategories = () => {
    setAnchorEl(null);
    setEditCategoriesIsOpen(true);
  };

  const handleCloseEditCategories = () => {
    setEditCategoriesIsOpen(false);
  };

  return (
    <>
      <Tooltip title="More">
        <IconButton onClick={handleClick}>
          <Icon>more_vert</Icon>
        </IconButton>
      </Tooltip>

      {/* getContentAnchorEl must be null to make anchorOrigin work */}
      {/* TODO: add transitionDuration so the changed text isn't visible too early */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleEditCategories}>Edit Categories</MenuItem>
      </Menu>

      <EditCategoriesDialog
        isOpen={editCategoriesIsOpen}
        onClose={handleCloseEditCategories}
      />
    </>
  );
};

export default LibraryMore;
