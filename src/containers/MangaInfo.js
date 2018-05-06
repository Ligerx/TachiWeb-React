import React, { Component } from 'react';
import { TWApi } from 'api';
import MangaInfoHeader from 'components/MangaInfoHeader';
import MangaInfoDetails from 'components/MangaInfoDetails';
import SortFilterMangaInfoChapters from 'components/SortFilterMangaInfoChapters';

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
      tabValue: 0,
      mangaInfo: {},
      chapters: [],
    };

    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    this.content = this.content.bind(this);
  }

  componentDidMount() {
    const { mangaId } = this.props.match.params;

    // API call 1, get manga info
    TWApi.Commands.MangaInfo.execute(
      (res) => {
        this.setState({ mangaInfo: res.content });
      },
      null,
      { mangaId },
    );

    // API call 2, get chapter list
    TWApi.Commands.Chapters.execute(
      (res) => {
        this.setState({ chapters: res.content });
      },
      null,
      { mangaId },
    );
  }

  handleFavoriteClick() {
    const { mangaId } = this.props.match.params;
    const { mangaInfo } = this.state;

    // Testing if object is empty
    if (Object.keys(mangaInfo).length === 0 && mangaInfo.constructor === Object) {
      console.error('MangaInfo handleFavoriteClick error, missing mangaInfo object');
      return;
    }

    TWApi.Commands.Favorite.execute(
      () => {
        this.setState(prevState => ({
          mangaInfo: {
            ...prevState.mangaInfo,
            favorite: !prevState.mangaInfo.favorite,
          },
        }));
      },
      null,
      { mangaId, favorite: !mangaInfo.favorite },
    );
  }

  handleChangeTab(event, newValue) {
    this.setState({ tabValue: newValue });
  }

  content() {
    const { tabValue, mangaInfo, chapters } = this.state;

    if (tabValue === 0) {
      return <MangaInfoDetails mangaInfo={mangaInfo} onFavoriteClick={this.handleFavoriteClick} />;
    } else if (tabValue === 1) {
      return <SortFilterMangaInfoChapters chapters={chapters} />;
    }

    console.log('MangaInfo content() error');
    return <div />;
  }

  render() {
    const { mangaInfo, tabValue } = this.state;

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

export default MangaInfo;
