// @flow
import React, { Component } from 'react';
import MangaInfo from 'components/MangaInfo';
import type { MangaInfoContainerProps } from 'containers/MangaInfoContainer';
import type { MangaType } from 'types';

// Honestly couldn't come up with a different name to differentiate it from MangaInfo component
// I might rename the other files in the /pages folder to include _Page at the end. I dunno...

class MangaInfoPage extends Component<MangaInfoContainerProps> {
  componentDidMount() {
    const { fetchMangaInfo, fetchChapters, updateChapters } = this.props;

    fetchMangaInfo().then(() => {
      // If we think the server hasn't had enough time to scrape the source website
      // for this mangaInfo, wait a little while and try fetching again.
      //
      // NOTE: This only updates the manga being viewed. Many of your other search results are
      //       likely missing information as well. Viewing them will then fetch the data.
      //
      // TODO: might try to do one additional fetch at a slightly later time. e.g. 1000 ms
      const { mangaInfo } = this.props;
      if (mangaInfo && possiblyMissingInfo(mangaInfo)) {
        setTimeout(() => {
          fetchMangaInfo();
        }, 300);
      }
    });

    fetchChapters().then(() => {
      // Fetch chapters cached on the server
      // If there are none, tell the server to scrape chapters from the site
      if (!this.props.chapters.length) {
        updateChapters();
      }
    });
  }

  handleRefreshClick = () => {
    this.props.updateMangaInfo();
    this.props.updateChapters();
  };

  render() {
    const {
      mangaInfo, chapters, fetchOrRefreshIsLoading, backUrl, defaultTab,
    } = this.props;

    return (
      <MangaInfo
        mangaInfo={mangaInfo}
        chapters={chapters}
        initialTabValue={defaultTab}
        onBackClick={backUrl}
        onRefreshClick={this.handleRefreshClick}
        isLoading={fetchOrRefreshIsLoading}
      />
    );
  }
}

// Helper methods
function possiblyMissingInfo(manga: MangaType): boolean {
  // mangaFields is an array of some values that mangaInfo should probably have
  // Count the number of these fields that are missing
  const mangaFields = ['author', 'description', 'genres', 'categories'];

  const numMissing = mangaFields.reduce((counter, field) => {
    const value = manga[field];

    if (!value || (Array.isArray(value) && !value.length)) {
      return counter + 1;
    }
    return counter;
  }, 0);

  // setting the arbitrary amount of missing info at 3 to be considered missing info
  return numMissing >= 3;
}

export default MangaInfoPage;
