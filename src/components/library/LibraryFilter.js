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

// FIXME: Refer to MangaInfoFilter for more details

type Props = {
  flags: LibraryFlagsType,
  onReadFilterChange: Function,
  onDownloadedFilterChange: Function,
  onCompletedFilterChange: Function,
};

type State = { anchorEl: ?HTMLElement };

class LibraryFilter extends Component<Props, State> {
  state = {
    anchorEl: null,
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleUnreadClick = () => {
    const { flags, onReadFilterChange } = this.props;
    const newReadFlag = flags.READ_FILTER === 'ALL' ? 'UNREAD' : 'ALL';
    onReadFilterChange(newReadFlag);
  };

  handleDownloadedClick = () => {
    const { flags, onDownloadedFilterChange } = this.props;
    const newDownloadedFlag = flags.DOWNLOADED_FILTER === 'ALL' ? 'DOWNLOADED' : 'ALL';
    onDownloadedFilterChange(newDownloadedFlag);
  };

  handleCompletedClick = () => {
    const { flags, onCompletedFilterChange } = this.props;
    const newCompletedFlag = flags.COMPLETED_FILTER === 'ALL' ? 'COMPLETED' : 'ALL';
    onCompletedFilterChange(newCompletedFlag);
  };

  render() {
    const { flags } = this.props;
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
              label="Downloaded"
              onChange={this.handleDownloadedClick}
              control={<Checkbox checked={flags.DOWNLOADED_FILTER === 'DOWNLOADED'} />}
            />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              label="Unread"
              onChange={this.handleUnreadClick}
              control={<Checkbox checked={flags.READ_FILTER === 'UNREAD'} />}
            />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              label="Completed"
              onChange={this.handleCompletedClick}
              control={<Checkbox checked={flags.COMPLETED_FILTER === 'COMPLETED'} />}
            />
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default LibraryFilter;
