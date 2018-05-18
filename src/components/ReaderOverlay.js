import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { Client } from 'api';
import { withStyles } from '@material-ui/core/styles';

// TODO: using two toolbars currently, but it might be too big. Consider changing/customizing later.
// NOTE: Material-UI v1 hasn't ported a slider component yet, so using an external library.
//       When it is added to Material-UI, use that instead.
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

const ReaderOverlay = ({
  title, chapterNum, mangaId, classes, children,
}) => (
  <AppBar position="static" color="default" className={classes.overlay}>
    <Toolbar>
      <IconButton component={Link} to={Client.manga(mangaId)}>
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

// Helper Function
function chapterNumFormatter(chapterNum) {
  // FIXME: This isn't smart enough to deal with more than 1 decimal point of precision
  // Could possibly just keep using toFixed until the trailing digit is 0
  const isInt = chapterNum % 1 === 0;
  if (isInt) {
    return chapterNum;
  }
  return chapterNum.toFixed(1);
}

ReaderOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  chapterNum: PropTypes.number.isRequired,
  mangaId: PropTypes.number.isRequired,
  // classes is the injected styles
  classes: PropTypes.object.isRequired,
  // children is what this component wraps around
  children: PropTypes.node,
};

ReaderOverlay.defaultProps = {
  children: null,
};

export default withStyles(styles)(ReaderOverlay);
