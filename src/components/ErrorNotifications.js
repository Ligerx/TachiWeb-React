import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import isEqual from 'lodash/isEqual';

// TODO: test this with 2, and 2+ errors to see if it works as intended

class ErrorNotifications extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // Add any new messages to the messages queue
    if (nextProps.errorMessage && !prevState.messages.includes(nextProps.errorMessage)) {
      return {
        ...prevState,
        messages: [...prevState.messages, nextProps.errorMessage],
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    // Because there could be more than one error message at a time, use an
    // array to queue the messages up in order.
    this.state = {
      open: false,
      messages: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleExited = this.handleExited.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { messages } = this.state;

    // On state/prop change when there are still errors queued up, trigger a snackbar
    // If there is one error, show a snackbar
    //
    // If there are more than one, close the current (which will remove it from the queue),
    // then show the next
    if (messages.length > 0 && !isEqual(prevState.messages, messages)) {
      if (messages.length === 1) {
        this.setState({ open: true });
      } else if (messages.length > 1) {
        this.setState({ open: false });
      }
    }
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;

    this.setState({ open: false });
  }

  handleExited = () => {
    // Remove the message in index 0
    this.setState({ messages: this.state.messages.slice(1) });
  };

  render() {
    const message = this.state.messages[0];

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
  errorMessage: null,
};

export default ErrorNotifications;
