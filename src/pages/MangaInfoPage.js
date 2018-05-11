import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';
import MangaInfo from 'components/MangaInfo';
import { Client } from 'api';

// Honestly couldn't come up with a different name to differentiate it from MangaInfo component
// I might rename the other files in the /pages folder to include _Page at the end. I dunno...

class MangaInfoPage extends Component {
  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchChapters();
  }

  render() {
    const {
      mangaInfoIsFetching,
      mangaInfo,
      chapters,
      isTogglingFavorite,
      toggleFavorite,
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
        isTogglingFavorite={isTogglingFavorite}
        toggleFavorite={toggleFavorite}
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
  toggleFavorite: PropTypes.func.isRequired,
};

// When data hasn't loaded yet, mangaInfo and chapters can be non-existant.
// That causes react to complain about propTypes, so set default values here.
MangaInfoPage.defaultProps = {
  mangaInfo: null,
  chapters: [],
};

export default MangaInfoPage;
