// @flow
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

type Props = {}; // TODO: nothing here, flow confused?
type State = {
  anchorEl: ?HTMLElement, // don't know what to put here
  filterDownloaded: boolean,
  filterUnread: boolean,
};

class FilterButton extends Component<Props, State> {
  state = {
    anchorEl: null,
    filterDownloaded: false,
    filterUnread: false,
  };

  handleClick = (event: SyntheticEvent<HTMLElement>) => {
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

  handleChange = (name: string) => (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ [name]: event.currentTarget.checked });
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
