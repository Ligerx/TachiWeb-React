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
  anchorEl: ?HTMLElement,
};

class MangaInfoFilter extends Component<Props, State> {
  state = {
    anchorEl: null,
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleRemoveFilters = () => {
    // Close the menu as well
    this.setState({ anchorEl: null });
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
            <FormControlLabel label="Read" control={<Checkbox checked={null} onChange={null} />} />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              label="Unread"
              control={<Checkbox checked={null} onChange={null} />}
            />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              label="Downloaded"
              control={<Checkbox checked={null} onChange={null} />}
            />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              label="Bookmarked"
              control={<Checkbox checked={null} onChange={null} />}
            />
          </MenuItem>

          <MenuItem onClick={this.handleRemoveFilters}>Remove Filters</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default MangaInfoFilter;
