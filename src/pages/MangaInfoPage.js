// @flow
import React, { Component } from 'react';
import type { MangaType, ChapterType } from 'types';
import MangaInfo from 'components/MangaInfo';
import { Client } from 'api';

type Props = {
  mangaInfo?: MangaType,
  chapters?: Array<ChapterType>,
  fetchOrRefreshIsLoading: boolean,
  fetchChapters: Function,
  updateChapters: Function,
  fetchMangaInfo: Function,
  updateMangaInfo: Function,
};

// Honestly couldn't come up with a different name to differentiate it from MangaInfo component
// I might rename the other files in the /pages folder to include _Page at the end. I dunno...

// NOTE: Not currently automatically requesting server to rescrape data
//       for the chapter list and manga info.
//       I'm assuming the server would have already scraped once when the
//       user added a manga via the catalogue.

class MangaInfoPage extends Component<Props> {
  static defaultProps = {
    mangaInfo: null,
    chapters: [],
  };

  componentDidMount() {
    this.props.fetchMangaInfo();
    this.props.fetchChapters();
  }

  handleRefreshClick = () => {
    this.props.updateMangaInfo();
    this.props.updateChapters();
  };

  render() {
    const { mangaInfo, chapters, fetchOrRefreshIsLoading } = this.props;

    return (
      <MangaInfo
        mangaInfo={mangaInfo}
        chapters={chapters}
        initialTabValue={1}
        onBackClick={Client.library()}
        onRefreshClick={this.handleRefreshClick}
        isLoading={fetchOrRefreshIsLoading}
      />
    );
  }
}

export default MangaInfoPage;
