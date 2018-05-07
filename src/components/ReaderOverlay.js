import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { Client } from 'api';

// ******** What pieces of data do I need? ********
// mangaInfo.title
// chapter.chapter_number plus some basic processing
// pageCount
// page (from url params)

// Helper Functions
function chapterNumFormatter(chapterNum) {
  // FIXME: This isn't smart enough to deal with more than 1 decimal point of precision
  // Could possibly just keep using toFixed until the trailing digit is 0
  const isInt = chapterNum % 1 === 0;
  if (isInt) {
    return chapterNum;
  }
  return chapterNum.toFixed(1);
}

// TODO: move these styles out to a withStyles wrapper
const ReaderOverlay = ({
  title, chapterNum, pageCount, mangaId, match,
}) => {
  const overlay = {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  };

  return (
    <div style={overlay}>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton component={Link} to={Client.manga(mangaId)}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="title" style={{ flex: 1 }}>
            {title}
          </Typography>
          <Typography variant="subheading"> Chapter {chapterNumFormatter(chapterNum)}</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

// Page {parseInt(match.params.page, 10) + 1} / {pageCount}

ReaderOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  chapterNum: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  mangaId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      page: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withRouter(ReaderOverlay);
