import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import RefreshButton from 'components/RefreshButton';
import MangaInfoTabs from 'components/MangaInfoTabs';
import { mangaType } from 'types';
import PropTypes from 'prop-types';
import BackButton from 'components/BackButton';

// If mangaInfo is null (e.g. when it is being fetched from the server)
// Title is empty, refresh click is disabled

const MangaInfoHeader = ({
  mangaInfo, tabValue, handleChangeTab, onBackClick, onRefreshClick,
}) => {
  const title = mangaInfo ? mangaInfo.title : '';
  const handleRefreshClick = mangaInfo ? onRefreshClick : (() => null);

  return (
    <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
      <Toolbar>
        <BackButton onBackClick={onBackClick} />
        <Typography variant="title" style={{ flex: 1 }}>
          {title}
        </Typography>
        <RefreshButton onClick={handleRefreshClick} />
        <IconButton>
          <Icon>open_in_new</Icon>
        </IconButton>
      </Toolbar>

      <MangaInfoTabs tabValue={tabValue} handleChange={handleChangeTab} />
    </AppBar>
  );
};

MangaInfoHeader.propTypes = {
  mangaInfo: mangaType, // technically required, but can be null if not fetched yet
  tabValue: PropTypes.number.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  onBackClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  onRefreshClick: PropTypes.func.isRequired,
};

MangaInfoHeader.defaultProps = {
  mangaInfo: null,
};

export default MangaInfoHeader;
