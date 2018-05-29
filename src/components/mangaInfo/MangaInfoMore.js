// @flow
import * as React from 'react';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DisplayModeDialogue from './DisplayModeDialogue';

type Props = {
  flagState: string,
  onDisplayModeChange: Function,
};

type State = {
  anchorEl: ?React.Node,
  displayModeOpen: boolean,
};

class MangaInfoMore extends React.Component<Props, State> {
  state = {
    anchorEl: null,
    displayModeOpen: false,
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

  render() {
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <IconButton onClick={this.handleClick}>
          <Icon>more_vert</Icon>
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={this.handleDisplayModeClick}>Change Display Mode</MenuItem>
          <MenuItem onClick={this.handleClose}>Sorting Mode</MenuItem>
          {/* <MenuItem>Download</MenuItem> */}
        </Menu>

        <DisplayModeDialogue
          open={this.state.displayModeOpen}
          value={this.props.flagState}
          onClose={this.handleDisplayModeClose}
        />
      </React.Fragment>
    );
  }
}

export default MangaInfoMore;
