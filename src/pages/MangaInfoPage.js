import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';
import MangaInfo from 'components/MangaInfo';
import { Client } from 'api';

// Honestly couldn't come up with a different name to differentiate it from MangaInfo component
// I might rename the other files in the /pages folder to include _Page at the end. I dunno...

// NOTE: Not currently automatically requesting server to rescrape data
//       for the chapter list and manga info.
//       I'm assuming the server would have already scraped once when the
//       user added a manga via the catalogue.

class MangaInfoPage extends Component {
  constructor(props) {
    super(props);

    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchChapters();
  }

  handleRefreshClick() {
    this.props.updateChapters(this.props.mangaInfo.id);
  }

  render() {
    const {
      mangaInfoIsFetching,
      mangaInfo,
      chapters,
      isTogglingFavorite,
      toggleFavoriteForManga,
    } = this.props;
    const noMangaData = !mangaInfo || Object.getOwnPropertyNames(mangaInfo).length === 0;

    if (noMangaData) {
      if (mangaInfoIsFetching) {
        return <CircularProgress />;
      }
      return null;
    }

    return (
      <MangaInfo
        mangaInfo={mangaInfo}
        chapters={chapters}
        initialTabValue={1}
        onBackClick={Client.library()}
        onRefreshClick={this.handleRefreshClick}
        isTogglingFavorite={isTogglingFavorite}
        toggleFavorite={toggleFavoriteForManga(mangaInfo.id, mangaInfo.favorite)}
      />
    );
  }
}

MangaInfoPage.propTypes = {
  mangaInfo: mangaType,
  chapters: PropTypes.arrayOf(chapterType),
  mangaInfoIsFetching: PropTypes.bool.isRequired,
  isTogglingFavorite: PropTypes.bool.isRequired,
  fetchLibrary: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
  toggleFavoriteForManga: PropTypes.func.isRequired,
  updateChapters: PropTypes.func.isRequired,
};

// When data hasn't loaded yet, mangaInfo and chapters can be non-existant.
// That causes react to complain about propTypes, so set default values here.
MangaInfoPage.defaultProps = {
  mangaInfo: null,
  chapters: [],
};

export default MangaInfoPage;
