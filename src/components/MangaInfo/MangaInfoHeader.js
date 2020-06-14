// @flow
import React, { useState } from "react";
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
import FullScreenLoading from "components/Loading/FullScreenLoading";
import { useUpdateChapters, useUpdateMangaInfo, useSetFlag } from "apiHooks";

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
  const [isUpdatingChapters, setIsUpdatingChapters] = useState(false);

  const updateChapters = useUpdateChapters(setIsUpdatingChapters);
  const updateMangaInfo = useUpdateMangaInfo();
  const setFlag = useSetFlag();

  const handleSetFlag = (flag, state) => {
    setFlag(mangaInfo, flag, state);
  };

  const handleRefreshClick = () => {
    updateChapters(mangaInfo.id);
    updateMangaInfo(mangaInfo.id);
  };

  return (
    <>
      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        <Toolbar>
          <BackButton onBackClick={onBackClick} />
          <Typography variant="h6" noWrap style={{ flex: 1 }}>
            {mangaInfo.title}
          </Typography>

          <RefreshButton onClick={handleRefreshClick} />

          <MangaInfoFilter
            flags={mangaInfo.flags}
            onReadFilterChange={handleReadFilterChange(handleSetFlag)}
            onDownloadedFilterChange={handleDownloadedFilterChange(
              handleSetFlag
            )}
          />

          <Tooltip title="Sort">
            <IconButton
              onClick={handleSortClick(handleSetFlag, mangaInfo.flags)}
            >
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

      {isUpdatingChapters && <FullScreenLoading />}
    </>
  );
};

function handleSortClick(handleSetFlag, flags) {
  return () => {
    const newSortDirection = flags.sortDirection === "DESC" ? "ASC" : "DESC";
    handleSetFlag("sortDirection", newSortDirection);
  };
}

function handleDisplayModeChange(handleSetFlag) {
  return newDisplayMode => handleSetFlag("displayMode", newDisplayMode);
}

function handleSortTypeChange(handleSetFlag) {
  return newSortType => handleSetFlag("sortType", newSortType);
}

function handleReadFilterChange(handleSetFlag) {
  return newReadFilter => handleSetFlag("readFilter", newReadFilter);
}

function handleDownloadedFilterChange(handleSetFlag) {
  return newDownloadedFilter =>
    handleSetFlag("downloadedFilter", newDownloadedFilter);
}

export default MangaInfoHeader;
