import React from 'react';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

// pages in the browser
function pageUrl(mangaId, chapter, page) {
  return `/reader/${mangaId}/${chapter}/${page}`;
}

// ******** What pieces of data do I need? ********
// mangaInfo.title
// chapter.chapter_number plus some basic processing
// pageCount
// page (from url params)
// onClick handler for next and previous chapters
// onClick handler for scrubbing between pages on the timeline(?)
const ReaderOverlay = ({
  mangaId, chapter, page, pageCount,
}) => {
  const button = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const overlay = {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  };

  return (
    <div style={overlay}>
      <IconButton
        component={Link}
        to={pageUrl(mangaId, chapter, parseInt(page, 10) - 1)}
        style={button}
      >
        <Icon>navigate_before</Icon>
      </IconButton>
      <IconButton
        component={Link}
        to={pageUrl(mangaId, chapter, parseInt(page, 10) + 1)}
        style={{ ...button, right: 0 }}
      >
        <Icon>navigate_next</Icon>
      </IconButton>

      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Title
          </Typography>
        </Toolbar>
      </AppBar>

      <h2>{pageCount}</h2>
      <h3>{`MangaId: ${mangaId}, Chapter: ${chapter}, Page ${page}`}</h3>
    </div>
  );
};

export default ReaderOverlay;
