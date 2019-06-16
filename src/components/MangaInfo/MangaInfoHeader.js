// @flow
import React from "react";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import RefreshButton from "components/RefreshButton";
import MangaInfoTabs from "components/MangaInfo/MangaInfoTabs";
import type { Manga } from "@tachiweb/api-client";
import BackButton from "components/BackButton";
import MangaInfoMore from "components/MangaInfo/MangaInfoMore";
import Tooltip from "@material-ui/core/Tooltip";
import MangaInfoFilter from "components/MangaInfo/MangaInfoFilter";
import { useDispatch } from "react-redux";
import {
  updateMangaInfo,
  setFlag
} from "redux-ducks/mangaInfos/actionCreators";
import { updateChapters } from "redux-ducks/chapters/actionCreators";

// NOTE: empty href in IconButton will not render <a>

type Props = {
  mangaInfo: Manga,
  tabValue: number,
  handleChangeTab: Function,
  onBackClick: string | Function
};

const MangaInfoHeader = ({
  mangaInfo,
  tabValue,
  handleChangeTab,
  onBackClick
}: Props) => {
  const dispatch = useDispatch();

  const handleSetFlag = (flag, state) => {
    dispatch(setFlag(mangaInfo.id, flag, state));
  };

  const handleRefreshClick = () => {
    // Running updateChapters also updates mangaInfo.chapters and mangaInfo.unread
    // So run updateMangaInfo after chapters
    dispatch(updateChapters(mangaInfo.id)).then(() =>
      dispatch(updateMangaInfo(mangaInfo.id))
    );
  };

  return (
    <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
      <Toolbar>
        <BackButton onBackClick={onBackClick} />
        <Typography variant="h6" style={{ flex: 1 }}>
          {mangaInfo.title}
        </Typography>

        <RefreshButton onClick={handleRefreshClick} />

        <MangaInfoFilter
          flags={mangaInfo.flags}
          onReadFilterChange={handleReadFilterChange(handleSetFlag)}
          onDownloadedFilterChange={handleDownloadedFilterChange(handleSetFlag)}
        />

        <Tooltip title="Sort">
          <IconButton onClick={handleSortClick(handleSetFlag, mangaInfo.flags)}>
            <Icon>sort_by_alpha</Icon>
          </IconButton>
        </Tooltip>

        <MangaInfoMore
          sourceUrl={mangaInfo.url}
          flags={mangaInfo.flags}
          onDisplayModeChange={handleDisplayModeChange(handleSetFlag)}
          onSortTypeChange={handleSortTypeChange(handleSetFlag)}
        />
      </Toolbar>

      <MangaInfoTabs tabValue={tabValue} handleChange={handleChangeTab} />
    </AppBar>
  );
};

function handleSortClick(handleSetFlag, flags) {
  return () =>
    setFlag("sortDirection", flags.sortDirection === "DESC" ? "ASC" : "DESC");
}

function handleDisplayModeChange(handleSetFlag) {
  return newDisplayMode => handleSetFlag("displayMode", newDisplayMode);
}

function handleSortTypeChange(handleSetFlag) {
  return newSortType => handleSetFlag("sortType", newSortType);
}

function handleReadFilterChange(handleSetFlag) {
  return newReadFilter => handleSetFlag("sortType", newReadFilter);
}

function handleDownloadedFilterChange(handleSetFlag) {
  return newDownloadedFilter =>
    handleSetFlag("downloadedFilter", newDownloadedFilter);
}

export default MangaInfoHeader;
