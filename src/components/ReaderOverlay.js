import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { Client } from 'api';
import PageSlider from 'components/PageSlider';

// ******** What pieces of data do I need? ********
// mangaInfo.title
// chapter.chapter_number plus some basic processing
// pageCount
// page (from url params)

// TODO: move these styles out to a withStyles wrapper
// TODO: using two toolbars currently, but it might be too big. Consider changing/customizing later.
// NOTE: Material-UI v1 hasn't ported a slider component yet, so use an external library.
//       When it is added to Material-UI, use that instead.
//       https://github.com/mui-org/material-ui/issues/4793
const ReaderOverlay = ({
  title, chapterNum, pageCount, mangaId,
}) => {
  // NOTE: removed match from the above, may need to add it back?
  const overlay = {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  };

  // FIXME: slider defaultValue not working???
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
        <Toolbar>
          <PageSlider pageCount={pageCount} />
        </Toolbar>
      </AppBar>
    </div>
  );
};

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
  pageCount: PropTypes.number.isRequired,
  mangaId: PropTypes.number.isRequired,
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     page: PropTypes.string.isRequired,
  //   }).isRequired,
  // }).isRequired,
};

export default ReaderOverlay;
