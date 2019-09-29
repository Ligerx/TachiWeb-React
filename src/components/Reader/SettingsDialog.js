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
import type { ReaderViewerType, SettingViewerType } from "types";
import Link from "components/Link";
import { selectDefaultViewer } from "redux-ducks/settings";

type Props = {
  open: boolean,
  onClose: () => any
};

const useStyles = makeStyles({});

const viewerNames = {
  DEFAULT: "Default",
  LEFT_TO_RIGHT: "Left to right",
  RIGHT_TO_LEFT: "Right to left",
  WEBTOON: "Webtoon"
};

const ReaderOverlay = ({ open, onClose }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const defaultViewer = useSelector(selectDefaultViewer);

  const blah = "";
  const blah2 = () => {};

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Select value={blah} onChange={blah2}>
          {Object.keys(viewerNames).map(viewer => (
            <MenuItem key={viewer} value={viewer}>
              {viewerPrettyPrint(viewer, defaultViewer)}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
    </Dialog>
  );
};

function viewerPrettyPrint(
  viewer: ReaderViewerType,
  defaultViewer: SettingViewerType
): string {
  if (viewer === "DEFAULT") {
    // defaultViewer is lowercase but viewer is upper case.
    // defaultViewer may also be null but I don't think there's a specific default type currently,
    // so I'm dropping the parentheses in that case.
    let val = "Default";
    if (defaultViewer != null) {
      val += ` (${viewerNames[defaultViewer.toUpperCase()]})`;
    }
    return val;
  }

  return viewerNames[viewer];
}

export default ReaderOverlay;
