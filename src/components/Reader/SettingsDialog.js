// @flow
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { MangaViewer } from "@tachiweb/api-client";
import type { SettingViewerType } from "types";
import { makeStyles } from "@material-ui/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Link from "components/Link";
import { selectDefaultViewer } from "redux-ducks/settings";
import { selectMangaViewer } from "redux-ducks/mangaInfos";
import { setMangaViewer } from "redux-ducks/mangaInfos/actionCreators";

type Props = {
  mangaId: number,
  open: boolean,
  onClose: () => any
};

const useStyles = makeStyles({});

// [Sept 28, 2019] Skipping "VERTICAL" because it's not present in the settings menu as of writing this.
const viewerNames = {
  DEFAULT: "Default",
  LEFT_TO_RIGHT: "Left to right",
  RIGHT_TO_LEFT: "Right to left",
  WEBTOON: "Webtoon"
};

const ReaderOverlay = ({ mangaId, open, onClose }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const viewer = useSelector(state => selectMangaViewer(state, mangaId));
  const defaultViewer = useSelector(selectDefaultViewer);

  const handleChangeViewer = event => {
    dispatch(setMangaViewer(mangaId, event.target.value));
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Viewer for this series"
          value={viewer}
          onChange={handleChangeViewer}
          variant="outlined"
        >
          {Object.keys(viewerNames).map(viewerName => (
            <MenuItem key={viewerName} value={viewerName}>
              {viewerPrettyPrint(viewerName, defaultViewer)}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

function viewerPrettyPrint(
  viewer: MangaViewer,
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
