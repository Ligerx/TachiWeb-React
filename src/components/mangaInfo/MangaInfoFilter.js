// @flow
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import type { FlagsType } from 'types';

// NOTE: A disabled FormControlLabel will not fire it's Checkbox onChange event
//       So I don't need to check if READ_FILTER === UNREAD in handleReadClick() for example

// FIXME: The entire MenuItem is clickable, but only the checkbox and label call onChange on click.
//   MenuItem doesn't have an onChange prop, so maybe the solution is to make the label full width?
//
//   I tried using MenuItem onClick instead, but clicking on FormControlLabel was causing it to
//   fire twice for some reason.

type Props = {
  flags: FlagsType,
  onReadFilterChange: Function,
  onDownloadsFilterChange: Function,
};

type State = { anchorEl: ?HTMLElement };

class MangaInfoFilter extends Component<Props, State> {
  state = {
    anchorEl: null,
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleRemoveFilters = () => {
    const { onReadFilterChange, onDownloadsFilterChange } = this.props;

    onReadFilterChange('ALL');
    onDownloadsFilterChange('ALL');

    this.setState({ anchorEl: null }); // Also close the menu
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  // TODO: remove this? dead code?
  handleChange = (name: string) => (event: SyntheticEvent<HTMLInputElement>) => {
    this.setState({ [name]: event.currentTarget.checked });
  };

  handleReadClick = () => {
    const { flags, onReadFilterChange } = this.props;
    const newReadFlag = flags.READ_FILTER === 'ALL' ? 'READ' : 'ALL';
    onReadFilterChange(newReadFlag);
  };

  handleUnreadClick = () => {
    const { flags, onReadFilterChange } = this.props;
    const newReadFlag = flags.READ_FILTER === 'ALL' ? 'UNREAD' : 'ALL';
    onReadFilterChange(newReadFlag);
  };

  handleDownloadedClick = () => {
    const { flags, onDownloadsFilterChange } = this.props;
    const newDownloadedFlag = flags.DOWNLOADED_FILTER === 'ALL' ? 'DOWNLOADED' : 'ALL';
    onDownloadsFilterChange(newDownloadedFlag);
  };

  render() {
    const { flags } = this.props;
    const { anchorEl } = this.state;

    const readIsDisabled = flags.READ_FILTER === 'UNREAD';
    const unreadIsDisabled = flags.READ_FILTER === 'READ';

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
              label="Read"
              onChange={this.handleReadClick}
              control={<Checkbox checked={flags.READ_FILTER === 'READ'} />}
              disabled={readIsDisabled}
            />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              label="Unread"
              onChange={this.handleUnreadClick}
              control={<Checkbox checked={flags.READ_FILTER === 'UNREAD'} />}
              disabled={unreadIsDisabled}
            />
          </MenuItem>

          <MenuItem>
            <FormControlLabel
              label="Downloaded"
              onChange={this.handleDownloadedClick}
              control={<Checkbox checked={flags.DOWNLOADED_FILTER === 'DOWNLOADED'} />}
            />
          </MenuItem>

          {/* TODO: bookmarked. Relies on a newer version of the backend I think? */}
          <MenuItem>
            <FormControlLabel
              label="Bookmarked"
              onChange={null}
              control={<Checkbox checked={false} />}
              disabled
              style={{ textDecoration: 'line-through' }}
            />
          </MenuItem>

          <MenuItem onClick={this.handleRemoveFilters}>Remove Filters</MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default MangaInfoFilter;
