// @flow
import React, { type Node } from "react";
import { useDispatch } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import type { ChapterType } from "types";
import { toggleRead } from "redux-ducks/chapters/actionCreators";

type Props = {
  mangaId: number,
  chapter: ChapterType,
  anchorEl: Node,
  onClose: () => any
};

const ChapterMenu = ({ mangaId, chapter, anchorEl, onClose }: Props) => {
  const dispatch = useDispatch();

  const handleToggleRead = (read: boolean) => () => {
    dispatch(toggleRead(mangaId, chapter.id, read));
    onClose();
  };

  return (
    // getContentAnchorEl must be null to make anchorOrigin work
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      getContentAnchorEl={null}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      {/* Not using the chapter download feature currently */}
      {/*
          <MenuItem onClick={null}>
            Download
          </MenuItem>
      */}

      {!chapter.read && (
        <MenuItem onClick={handleToggleRead(true)}>Mark as Read</MenuItem>
      )}

      {(chapter.read || (!chapter.read && chapter.last_page_read > 0)) && (
        <MenuItem onClick={handleToggleRead(false)}>Mark as Unread</MenuItem>
      )}

      {/* TODO: use the new API for marking multiple chapters as read */}
      <MenuItem disabled onClick={null}>
        Mark previous as Read
      </MenuItem>
    </Menu>
  );
};

export default ChapterMenu;
