import React from 'react';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import RefreshButton from 'components/RefreshButton';
import MangaInfoTabs from 'components/MangaInfoTabs';

const MangaInfoHeader = ({ mangaInfo, tabValue, handleChangeTab }) => (
  <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
    <Toolbar>
      <IconButton>
        <Icon>arrow_back</Icon>
      </IconButton>
      <Typography variant="title" style={{ flex: 1 }}>
        {mangaInfo.title}
      </Typography>
      <RefreshButton />
      <IconButton>
        <Icon>open_in_new</Icon>
      </IconButton>
    </Toolbar>

    <MangaInfoTabs tabValue={tabValue} handleChange={handleChangeTab} />
  </AppBar>
);

export default MangaInfoHeader;
