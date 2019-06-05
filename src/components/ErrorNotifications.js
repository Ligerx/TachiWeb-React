// @flow
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { allErrorsSelector } from "redux-ducks/error";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

// TODO: Honestly, the logic here feels really fragile, and I don't
//       have the best grasp of all the edge cases.
//       Maybe finding a library would be helpful for this.

const ErrorNotifications = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const errorMessage = useSelector(allErrorsSelector);

  useEffect(() => {
    if (message === errorMessage) return;

    if (!errorMessage) {
      setOpen(false);
      setMessage("");
    } else if (!open) {
      setOpen(true);
      setMessage(errorMessage);
    } else if (open) {
      setOpen(false);
      // then let handleExited() update if necessary
    }
  }, [errorMessage, message, open]);

  const handleClose = (event: SyntheticEvent<>, reason: ?string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleExited = () => {
    if (message === errorMessage) return;
    setOpen(true);
    setMessage(errorMessage);
  };

  return (
    <Snackbar
      key={message}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      onExited={handleExited}
      message={<span id="message-id">{message}</span>}
      action={
        <IconButton onClick={handleClose}>
          <Icon>close</Icon>
        </IconButton>
      }
    />
  );
};

export default ErrorNotifications;
