// @flow
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { Client } from 'api';
import { withStyles } from '@material-ui/core/styles';

// TODO: using two toolbars currently, but it might be too big. Consider changing/customizing later.
// NOTE: Material-UI v1 hasn't ported a slider component yet, so using an external library.
//       When it is added to Material-UI, consider using that instead.
//       https://github.com/mui-org/material-ui/issues/4793

const styles = {
  overlay: {
    // Overlay it above the image
    width: '100%',
    position: 'absolute',
    zIndex: 1,

    // Visible only on hover
    opacity: 0,
    transition: 'opacity .2s ease-in-out',
    '&:hover': {
      opacity: 1,
    },
  },
};

type Props = {
  classes: Object,
  title: string,
  chapterNum: number,
  mangaId: number,
  children?: React.Node,

  urlPrefix: string, // kind of a hack
};

const ReaderOverlay = ({
  title, chapterNum, mangaId, classes, children, urlPrefix,
}: Props) => (
  <AppBar position="static" color="default" className={classes.overlay}>
    <Toolbar>
      <IconButton component={Link} to={urlPrefix + Client.manga(mangaId)}>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography variant="title" style={{ flex: 1 }}>
        {title}
      </Typography>
      <Typography variant="subheading"> Chapter {chapterNumFormatter(chapterNum)}</Typography>
    </Toolbar>
    {children && <Toolbar>{children}</Toolbar>}
  </AppBar>
);

ReaderOverlay.defaultProps = {
  children: null,
};

// Helper Function
function chapterNumFormatter(chapterNum: number): string | number {
  // FIXME: This isn't smart enough to deal with more than 1 decimal point of precision
  // Could possibly just keep using toFixed until the trailing digit is 0
  const isInt = chapterNum % 1 === 0;
  if (isInt) {
    return chapterNum;
  }
  return chapterNum.toFixed(1);
}

export default withStyles(styles)(ReaderOverlay);
