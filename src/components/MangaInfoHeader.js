// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import RefreshButton from 'components/RefreshButton';
import MangaInfoTabs from 'components/MangaInfoTabs';
import type { MangaType } from 'types';
import BackButton from 'components/BackButton';
import MangaInfoMore from 'components/mangaInfo/MangaInfoMore';
import Tooltip from '@material-ui/core/Tooltip';
import MangaInfoFilter from 'components/mangaInfo/MangaInfoFilter';

// TODO: tooltips

// NOTE: empty href in IconButton will not render <a>

type Props = {
  // If mangaInfo is null (e.g. when it is being fetched from the server)
  // Title is empty, refresh click is disabled
  mangaInfo: ?MangaType,
  tabValue: number,
  handleChangeTab: Function,
  onBackClick: string | Function,
  onRefreshClick: Function,
  setFlag: Function,
};

const MangaInfoHeader = ({
  mangaInfo,
  tabValue,
  handleChangeTab,
  onBackClick,
  onRefreshClick,
  setFlag,
}: Props) => (
  <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
    <Toolbar>
      {mangaInfo && (
        <React.Fragment>
          <BackButton onBackClick={onBackClick} />
          <Typography variant="title" style={{ flex: 1 }}>
            {mangaInfo.title}
          </Typography>

          <Tooltip title="Open source website">
            <IconButton href={mangaInfo.url} target="_blank">
              <Icon>open_in_new</Icon>
            </IconButton>
          </Tooltip>

          <RefreshButton onClick={onRefreshClick} />

          <MangaInfoFilter
            flags={mangaInfo.flags}
            onReadFilterChange={handleReadFilterChange(setFlag)}
            onDownloadsFilterChange={handleDownloadedFilterChange(setFlag)}
          />

          <Tooltip title="Sort">
            <IconButton onClick={handleSortClick(setFlag, mangaInfo.flags)}>
              <Icon>sort_by_alpha</Icon>
            </IconButton>
          </Tooltip>

          <MangaInfoMore
            flags={mangaInfo.flags}
            onDisplayModeChange={handleDisplayModeChange(setFlag)}
            onSortTypeChange={handleSortTypeChange(setFlag)}
          />
        </React.Fragment>
      )}
    </Toolbar>

    <MangaInfoTabs tabValue={tabValue} handleChange={handleChangeTab} />
  </AppBar>
);

function handleSortClick(setFlag, flags) {
  return () => {
    const newState = flags.SORT_DIRECTION === 'DESCENDING' ? 'ASCENDING' : 'DESCENDING';
    setFlag('SORT_DIRECTION', newState);
  };
}

function handleDisplayModeChange(setFlag) {
  return newDisplayMode => setFlag('DISPLAY_MODE', newDisplayMode);
}

function handleSortTypeChange(setFlag) {
  return newSortType => setFlag('SORT_TYPE', newSortType);
}

function handleReadFilterChange(setFlag) {
  return newReadFilter => setFlag('READ_FILTER', newReadFilter);
}

function handleDownloadedFilterChange(setFlag) {
  return newDownloadedFilter => setFlag('DOWNLOADED_FILTER', newDownloadedFilter);
}

export default MangaInfoHeader;
