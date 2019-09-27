// @flow
import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import type { ChapterType } from "types";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";

// Because this is nested inside ChapterListItem, which wraps the entire thing with a Link
// You have to e.preventDefault() everywhere to stop from navigating to the Reader unintentionally

type Props = {
  chapter: ChapterType,
  toggleRead: Function
};

const useStyles = makeStyles({
  hiddenMenuItem: { display: "none" }
});

const ChapterMenu = ({ chapter, toggleRead }: Props) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: SyntheticEvent<>) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const handleToggleRead = (read: boolean) => (event: SyntheticEvent<>) => {
    event.preventDefault();
    toggleRead(read);
    setAnchorEl(null);
  };

  const showMarkAsRead = !chapter.read;
  const showMarkAsUnread =
    chapter.read || (!chapter.read && chapter.last_page_read > 0);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Icon>more_vert</Icon>
      </IconButton>

      {/* getContentAnchorEl must be null to make anchorOrigin work */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* Not using the chapter download feature currently */}
        {/*
          <MenuItem onClick={null}>
            Download
          </MenuItem>
          */}

        <MenuItem
          onClick={handleToggleRead(true)}
          className={classNames({
            [classes.hiddenMenuItem]: !showMarkAsRead
          })}
        >
          Mark as Read
        </MenuItem>

        <MenuItem
          onClick={handleToggleRead(false)}
          className={classNames({
            [classes.hiddenMenuItem]: !showMarkAsUnread
          })}
        >
          Mark as Unread
        </MenuItem>

        {/* TODO: use the new API for marking multiple chapters as read */}
        {/*
          <MenuItem onClick={null}>Mark previous as Read</MenuItem>
          */}
      </Menu>
    </>
  );
};

export default ChapterMenu;
