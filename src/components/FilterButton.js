import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import Menu, { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';

class FilterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      filterDownloaded: false,
      filterUnread: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleRemoveFilters = this.handleRemoveFilters.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleRemoveFilters = () => {
    // Close the menu as well
    this.setState({
      anchorEl: null,
      filterDownloaded: false,
      filterUnread: false,
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChange = name => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <Tooltip title="Filter">
          <IconButton onClick={this.handleClick}>
            <Icon>filter_list</Icon>
          </IconButton>
        </Tooltip>

        {/* getContentAnchorEl must be null to make anchorOrigin work */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.filterDownloaded}
                  onChange={this.handleChange('filterDownloaded')}
                />
              }
              label="Downloaded"
            />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.filterUnread}
                  onChange={this.handleChange('filterUnread')}
                />
              }
              label="Unread"
            />
          </MenuItem>
          <MenuItem onClick={this.handleRemoveFilters}>Remove Filters</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default FilterButton;
