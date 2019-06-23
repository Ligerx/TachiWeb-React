// @flow
import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditCategoriesDialog from "components/Library/EditCategoriesDialog";

type State = {
  anchorEl: ?HTMLElement, // don't know what to put here
  editCategoriesIsOpen: boolean
};

class LibraryMore extends Component<{}, State> {
  state = {
    anchorEl: null,
    editCategoriesIsOpen: false
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleEditCategories = () => {
    // Close the menu as well
    this.setState({
      anchorEl: null,
      editCategoriesIsOpen: true
    });
  };

  handleCloseEditCategories = () => {
    this.setState({ editCategoriesIsOpen: false });
  };

  render() {
    const { anchorEl, editCategoriesIsOpen } = this.state;

    return (
      <>
        <Tooltip title="More">
          <IconButton onClick={this.handleClick}>
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
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleEditCategories}>
            Edit Categories
          </MenuItem>
        </Menu>

        <EditCategoriesDialog
          isOpen={editCategoriesIsOpen}
          onClose={this.handleCloseEditCategories}
        />
      </>
    );
  }
}

export default LibraryMore;
