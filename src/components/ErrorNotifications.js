import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import isEqual from 'lodash/isEqual';

// TODO: test this with 2, and 2+ errors to see if it works as intended

// Rewrite this, simplify it, error is just a string
//     handleExited should still remove the error in state I believe
// if I receive a new message
//     setState for message and open
// if error becomes empty while a message is currently open
//     close the message (and remove error in state)
// if I receive a new message while there is already a message
//     I think closing the current message may be all that's necessary?
//
// so those last 2 situations are actually the same
// and because the only props this component gets is errorMessage,
// I can just do whatever in componentDidUpdate()

// running into a bug where it goes in an infinite loop
// I clear the message, but because the props technically didn't change, it loops forever
// Solution: store a previousMessage in state?

class ErrorNotifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      errorMessage: '',
      previousMessage: '',
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleExited = this.handleExited.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { errorMessage, previousMessage } = this.state;
    const { errorMessage: newMessage } = this.props;

    // if (newMessage === previousMessage && !errorMessage) return;

    const changedMessage = newMessage !== previousMessage;
    const errorRemoved = errorMessage && !newMessage;
    const replaceError = errorMessage && newMessage && errorMessage !== newMessage;

    if (!errorMessage && newMessage && changedMessage) {
      this.setState({ open: true, errorMessage: newMessage });
    } else if (errorRemoved || replaceError) {
      // handleExited() will deal with clearing the errorMessage in state
      // Because the state changed, it should then call componentDidUpdate() again
      // which will then show any new message
      this.setState({ open: false });
    }

    // On state/prop change when there are still errors queued up, trigger a snackbar
    // If there is one error, show a snackbar
    //
    // If there are more than one, close the current (which will remove it from the queue),
    // then show the next
    // if (messages.length > 0 && !isEqual(prevState.messages, messages)) {
    //   if (messages.length === 1) {
    //     this.setState({ open: true });
    //   } else if (messages.length > 1) {
    //     this.setState({ open: false });
    //   }
    // }
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;

    this.setState({ open: false });
  }

  handleExited = () => {
    // Remove the message in index 0
    this.setState({ errorMessage: '', previousMessage: this.state.errorMessage });
  };

  render() {
    return (
      <Snackbar
        key={this.state.errorMessage}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        onExited={this.handleExited}
        message={<span id="message-id">{this.state.errorMessage}</span>}
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
