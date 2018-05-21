import React, { Component } from 'react';
import MangaInfoHeader from 'components/MangaInfoHeader';
import MangaInfoDetails from 'components/MangaInfoDetails';
import SortFilterMangaInfoChapters from 'components/SortFilterMangaInfoChapters';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';
import FavoriteFAB from 'components/FavoriteFAB';
import FullScreenLoading from 'components/loading/FullScreenLoading';

// FEATURES TODO:
// mark as read
// mark as unread
// download
// delete

class MangaInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: props.initialTabValue,
    };

    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.tabContent = this.tabContent.bind(this);
  }

  handleChangeTab(event, newValue) {
    this.setState({ tabValue: newValue });
  }

  tabContent() {
    const { tabValue } = this.state;
    const {
      mangaInfo, chapters, favoriteIsToggling, toggleFavorite,
    } = this.props;

    const isFavorite = mangaInfo ? mangaInfo.favorite : false;
    const numChapters = chapters ? chapters.length : 0;

    if (tabValue === 0) {
      return (
        <MangaInfoDetails mangaInfo={mangaInfo} numChapters={numChapters}>
          <FavoriteFAB
            isFavorite={isFavorite}
            favoriteIsToggling={favoriteIsToggling}
            toggleFavorite={toggleFavorite}
          />
        </MangaInfoDetails>
      );
    } else if (tabValue === 1) {
      return <SortFilterMangaInfoChapters mangaInfo={mangaInfo} chapters={chapters} />;
    }

    console.error('MangaInfo content() error');
    return <div />;
  }

  render() {
    const { tabValue } = this.state;
    const { mangaInfo, onBackClick, onRefreshClick, isLoading } = this.props;

    return (
      <React.Fragment>
        <MangaInfoHeader
          mangaInfo={mangaInfo}
          tabValue={tabValue}
          handleChangeTab={this.handleChangeTab}
          onBackClick={onBackClick}
          onRefreshClick={onRefreshClick}
        />
        {this.tabContent()}

        {isLoading && <FullScreenLoading />}
      </React.Fragment>
    );
  }
}

MangaInfo.propTypes = {
  mangaInfo: mangaType,
  chapters: PropTypes.arrayOf(chapterType),
  initialTabValue: PropTypes.number.isRequired,
  onBackClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  onRefreshClick: PropTypes.func.isRequired,
  favoriteIsToggling: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

MangaInfo.defaultProps = {
  mangaInfo: null,
  chapters: [],
};

export default MangaInfo;
