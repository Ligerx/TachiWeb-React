import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

// TODO: Honestly, the logic here feels really fragile, and I don't
//       have the best grasp of all the edge cases.
//       Maybe finding a library would be helpful for this.

class ErrorNotifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      message: '',
    };
  }

  componentDidUpdate() {
    const { open, message } = this.state;
    const { errorMessage: propsMessage } = this.props;

    if (message === propsMessage) return;

    if (!propsMessage) {
      this.setState({ open: false, message: '' });
    } else if (!open) {
      this.setState({ open: true, message: propsMessage });
    } else if (open) {
      this.setState({ open: false });
      // then let handleExited() update if necessary
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    this.setState({ open: false });
  };

  handleExited = () => {
    const { message } = this.state;
    const { errorMessage: propsMessage } = this.props;

    if (message !== propsMessage) {
      this.setState({ open: true, message: propsMessage });
    }
  };

  render() {
    const { message } = this.state;

    return (
      <Snackbar
        key={message}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        onExited={this.handleExited}
        message={<span id="message-id">{message}</span>}
        action={
          <IconButton onClick={this.handleClose}>
            <Icon>close</Icon>
          </IconButton>
        }
      />
    );
  }
}

ErrorNotifications.propTypes = {
  errorMessage: PropTypes.string,
};

ErrorNotifications.defaultProps = {
  errorMessage: '',
};

export default ErrorNotifications;
