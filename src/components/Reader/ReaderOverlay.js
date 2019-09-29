// @flow
import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import PageSlider from "components/Reader/PageSlider";
import SettingsDialog from "components/Reader/SettingsDialog";
import Link from "components/Link";
import { chapterNumPrettyPrint } from "components/utils";

// TODO: using two toolbars currently, but it might be too big. Consider changing/customizing later.

// NOTE: Material-UI v1 hasn't ported a slider component yet, so using an external library.
//       When it is added to Material-UI, consider using that instead.
//       https://github.com/mui-org/material-ui/issues/4793

type Props = {
  mangaId: number,
  title: string,
  chapterNum: number,
  pageCount: number,
  page: number,
  backUrl: string,
  prevChapterUrl: ?string,
  nextChapterUrl: ?string,
  onJumpToPage: number => any
};

const useStyles = makeStyles({
  overlay: {
    // Overlay it above the image
    width: "100%",
    position: "fixed",
    top: 0,
    zIndex: 1,

    // Visible only on hover
    opacity: 0,
    transition: "opacity .2s ease-in-out",
    "&:hover": {
      opacity: 1
    }
  }
});

const ReaderOverlay = ({
  mangaId,
  title,
  chapterNum,
  pageCount,
  page,
  backUrl,
  prevChapterUrl,
  nextChapterUrl,
  onJumpToPage
}: Props) => {
  const classes = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  return (
    <AppBar position="static" color="default" className={classes.overlay}>
      <Toolbar>
        <IconButton component={Link} to={backUrl}>
          <Icon>arrow_back</Icon>
        </IconButton>

        <Typography variant="h6" noWrap style={{ flex: 1 }}>
          {title}
        </Typography>

        <Typography variant="subtitle1">
          Chapter {chapterNumPrettyPrint(chapterNum)}
        </Typography>

        <Tooltip title="Settings">
          <IconButton onClick={handleSettingsClick}>
            <Icon>settings</Icon>
          </IconButton>
        </Tooltip>

        <SettingsDialog
          mangaId={mangaId}
          open={settingsOpen}
          onClose={handleSettingsClose}
        />
      </Toolbar>

      <Toolbar>
        <IconButton
          component={Link}
          to={prevChapterUrl}
          disabled={!prevChapterUrl}
        >
          <Icon>skip_previous</Icon>
        </IconButton>

        <PageSlider
          pageCount={pageCount}
          page={page}
          onJumpToPage={onJumpToPage}
        />

        <IconButton
          component={Link}
          to={nextChapterUrl}
          disabled={!nextChapterUrl}
        >
          <Icon>skip_next</Icon>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ReaderOverlay;
