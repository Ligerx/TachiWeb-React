import React, { Component } from 'react';
import MangaInfoHeader from 'components/MangaInfoHeader';
import MangaInfoDetails from 'components/MangaInfoDetails';
import SortFilterMangaInfoChapters from 'components/SortFilterMangaInfoChapters';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';
import FavoriteFAB from 'components/FavoriteFAB';

// NOTES: From the previous code: When you update the server's manga info + chapter list,
//        you should also update the client when it's complete

// FEATURES TODO:
// mark as read
// mark as unread
// download
// delete
// favorite/unfavorite
// update info and chapters

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
      mangaInfo, chapters, isTogglingFavorite, toggleFavorite,
    } = this.props;

    if (tabValue === 0) {
      return (
        <MangaInfoDetails mangaInfo={mangaInfo}>
          <FavoriteFAB
            isFavorite={mangaInfo.favorite}
            isTogglingFavorite={isTogglingFavorite}
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
    const { mangaInfo, onBackClick } = this.props;

    return (
      <React.Fragment>
        <MangaInfoHeader
          mangaInfo={mangaInfo}
          tabValue={tabValue}
          handleChangeTab={this.handleChangeTab}
          onBackClick={onBackClick}
        />
        {this.tabContent()}
      </React.Fragment>
    );
  }
}

MangaInfo.propTypes = {
  mangaInfo: mangaType.isRequired,
  chapters: PropTypes.arrayOf(chapterType).isRequired,
  initialTabValue: PropTypes.number.isRequired,
  onBackClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  isTogglingFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
};

export default MangaInfo;
