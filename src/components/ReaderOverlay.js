import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

// ******** What pieces of data do I need? ********
// mangaInfo.title
// chapter.chapter_number plus some basic processing
// pageCount
// page (from url params)
// onClick handler for next and previous chapters
// onClick handler for scrubbing between pages on the timeline(?)
const ReaderOverlay = () => {
  const overlay = {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  };

  return (
    <div style={overlay}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Title
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default ReaderOverlay;
