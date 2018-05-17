import React from 'react';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import RefreshButton from 'components/RefreshButton';
import MangaInfoTabs from 'components/MangaInfoTabs';
import { mangaType } from 'types';
import PropTypes from 'prop-types';
import BackButton from 'components/BackButton';

// TODO: Currently, refresh button only updates chapters, but not mangaInfo
//       Not sure if updating mangaInfo even matters.
//       If you do implement this, just have refresh click update both at the same time.
//       ^ easier this way

const MangaInfoHeader = ({
  mangaInfo, tabValue, handleChangeTab, onBackClick, onRefreshClick,
}) => (
  <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
    <Toolbar>
      <BackButton onBackClick={onBackClick} />
      <Typography variant="title" style={{ flex: 1 }}>
        {mangaInfo.title}
      </Typography>
      <RefreshButton onClick={onRefreshClick} />
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
  onBackClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  onRefreshClick: PropTypes.func.isRequired,
};

export default MangaInfoHeader;
