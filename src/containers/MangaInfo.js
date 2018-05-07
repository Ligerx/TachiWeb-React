import React, { Component } from 'react';
import MangaInfoHeader from 'components/MangaInfoHeader';
import MangaInfoDetails from 'components/MangaInfoDetails';
import SortFilterMangaInfoChapters from 'components/SortFilterMangaInfoChapters';
import { CircularProgress } from 'material-ui/Progress';
import { mangaType, chapterType } from 'types';
import PropTypes from 'prop-types';

// NOTES: From the previous code: When you update the server's manga info or chapter list,
//    you should also update the client when it's complete

// FEATURES TODO:
// mark as read
// mark as unread
// download
// delete
// favorite/unfavorite
// update info and chapters

// TODO: errors due to trying to render props when the data hasn't been loaded yet.
//       I'm not using map, so it's trying to render stuff early

class MangaInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabValue: 1,
    };

    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.content = this.content.bind(this);
  }

  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchChapters();
  }

  handleChangeTab(event, newValue) {
    this.setState({ tabValue: newValue });
  }

  content() {
    const { tabValue } = this.state;
    const { mangaInfo, chapters } = this.props;

    if (tabValue === 0) {
      return <MangaInfoDetails mangaInfo={mangaInfo} />;
    } else if (tabValue === 1) {
      return <SortFilterMangaInfoChapters mangaInfo={mangaInfo} chapters={chapters} />;
    }

    console.log('MangaInfo content() error');
    return <div />;
  }

  render() {
    const { tabValue } = this.state;
    const { mangaInfoIsFetching, mangaInfo } = this.props;
    const noMangaData = !mangaInfo || Object.getOwnPropertyNames(mangaInfo).length === 0;

    if (noMangaData) {
      if (mangaInfoIsFetching) {
        return <CircularProgress />;
      }
      return null;
    }

    return (
      <React.Fragment>
        <MangaInfoHeader
          mangaInfo={mangaInfo}
          tabValue={tabValue}
          handleChangeTab={this.handleChangeTab}
        />
        {this.content()}
      </React.Fragment>
    );
  }
}

// When data hasn't loaded yet, mangaInfo and chapters can be non-existant.
// That causes react to complain about propTypes, so set default values here.
MangaInfo.propTypes = {
  mangaInfo: mangaType,
  chapters: PropTypes.arrayOf(chapterType),
  mangaInfoIsFetching: PropTypes.bool.isRequired,
  fetchLibrary: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
};

MangaInfo.defaultProps = {
  mangaInfo: null,
  chapters: [],
};

export default MangaInfo;
