// @flow
import * as React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import type { FlagsType } from 'types';
import RadioOptionsDialogue from './RadioOptionsDialogue';

const displayModes = [
  { flagState: 'NAME', label: 'Show title' },
  { flagState: 'NUMBER', label: 'Show chapter number' },
];

const sortingModes = [
  { flagState: 'SOURCE', label: 'By source' },
  { flagState: 'NUMBER', label: 'By chapter number' },
];

type Props = {
  flags: FlagsType,
  onDisplayModeChange: Function,
  onSortTypeChange: Function,
};

type State = {
  anchorEl: ?React.Node,
  displayModeOpen: boolean,
  sortTypeOpen: boolean,
};

class MangaInfoMore extends React.Component<Props, State> {
  state = {
    anchorEl: null,
    displayModeOpen: false,
    sortTypeOpen: false,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDisplayModeClick = () => {
    this.setState({ displayModeOpen: true });
    this.handleClose();
  };

  handleDisplayModeClose = (value: ?string) => {
    this.setState({ displayModeOpen: false });
    if (value) {
      this.props.onDisplayModeChange(value);
    }
  };

  handleSortTypeClick = () => {
    this.setState({ sortTypeOpen: true });
    this.handleClose();
  };

  handleSortTypeClose = (value: ?string) => {
    this.setState({ sortTypeOpen: false });
    if (value) {
      this.props.onSortTypeChange(value);
    }
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <IconButton onClick={this.handleClick}>
          <Icon>more_vert</Icon>
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.handleDisplayModeClick}>Change Display Mode</MenuItem>
          <MenuItem onClick={this.handleSortTypeClick}>Sorting Mode</MenuItem>
          {/* <MenuItem>Download</MenuItem> */}
        </Menu>

        <RadioOptionsDialogue
          title="Choose Display Mode"
          open={this.state.displayModeOpen}
          value={this.props.flags.DISPLAY_MODE}
          options={displayModes}
          onClose={this.handleDisplayModeClose}
        />

        <RadioOptionsDialogue
          title="Sorting Mode"
          open={this.state.sortTypeOpen}
          value={this.props.flags.SORT_TYPE}
          options={sortingModes}
          onClose={this.handleSortTypeClose}
        />
      </React.Fragment>
    );
  }
}

export default MangaInfoMore;
