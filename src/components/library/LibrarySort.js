// @flow
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import type { LibraryFlagsType } from 'types';

type Props = {
  flags: LibraryFlagsType,
};

type State = { anchorEl: ?HTMLElement };

class LibrarySort extends Component<Props, State> {
  state = {
    anchorEl: null,
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { flags } = this.props;
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <Tooltip title="Sort">
          <IconButton onClick={this.handleClick}>
            <Icon>sort_by_alpha</Icon>
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
              label="Downloaded"
              onChange={null}
              control={<Checkbox checked={flags.DOWNLOADED_FILTER === 'DOWNLOADED'} />}
            />
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default LibrarySort;
