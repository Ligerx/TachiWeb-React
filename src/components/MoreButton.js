import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import Menu, { MenuItem } from 'material-ui/Menu';

class MoreButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      editing: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleEditCategories = this.handleEditCategories.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleEditCategories = () => {
    // Close the menu as well
    this.setState({
      anchorEl: null,
      editing: !this.state.editing,
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl, editing } = this.state;

    return (
      <React.Fragment>
        <Tooltip title="More">
          <IconButton onClick={this.handleClick}>
            <Icon>more_vert</Icon>
          </IconButton>
        </Tooltip>

        {/* getContentAnchorEl must be null to make anchorOrigin work */}
        {/* TODO: add transitionDuration so the changed text isn't visible too early */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleEditCategories}>
            {!editing ? 'Edit Categories' : 'Exit Category Editor'}
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default MoreButton;
