// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

type Props = { className?: string };

const useStyles = makeStyles({
  icon: {
    verticalAlign: "middle"
  }
});

const HelpDialog = ({ className }: Props) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleOpen} className={className}>
        <Icon>help</Icon>
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Getting Started</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>Installing an extension</strong> gives you access to manga
            hosting websites such as KissManga or MangaDex. We call these
            catalogues.
            <br />
            <br />
            You can <strong>search for, read, and bookmark manga</strong> from
            any catalogue you have added.
            <br />
            <br />
            You can <strong>bookmark any manga</strong> that you find.
            Bookmarked manga from all categories will be saved to this page.
            <br />
            <br />
            Press the <Icon className={classes.icon}>menu</Icon> hamburger menu
            button, then the Extensions link to get started.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpDialog;
