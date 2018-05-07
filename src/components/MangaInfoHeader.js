import React from 'react';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import RefreshButton from 'components/RefreshButton';
import MangaInfoTabs from 'components/MangaInfoTabs';
import { Link } from 'react-router-dom';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';

const MangaInfoHeader = ({ mangaInfo, tabValue, handleChangeTab }) => (
  <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
    <Toolbar>
      <IconButton component={Link} to="/library">
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

MangaInfoHeader.propTypes = {
  mangaInfo: mangaType.isRequired,
  tabValue: PropTypes.number.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
};

export default MangaInfoHeader;
