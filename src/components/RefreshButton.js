import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';

class RefreshButton extends Component {
  constructor(props) {
    super(props);
    // this.props = {
    //   handleClick: null
    // };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () =>
    // TODO
    null;

  render() {
    // const { handleClick } = this.props;

    return (
      <Tooltip title="Refresh">
        <IconButton onClick={this.handleClick}>
          <Icon>refresh</Icon>
        </IconButton>
      </Tooltip>
    );
  }
}

export default RefreshButton;
