// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Link from "components/Link";

type Props = {
  open: boolean,
  onClose: () => any
};

const useStyles = makeStyles({});

const ReaderOverlay = ({ open, onClose }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const blah = "";
  const blah2 = () => {};

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Select value={blah} onChange={blah2}>
          <MenuItem value={10}>Ten</MenuItem>
        </Select>
      </DialogContent>
    </Dialog>
  );
};

export default ReaderOverlay;
