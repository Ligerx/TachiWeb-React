import React, { Component } from 'react';
import TWApi from 'api';

// NOTES: From the previous code: When you update the server's manga info or chapter list,
//    you should also update the client when it's complete

// FEATURES TODO:
// mark as read
// mark as unread
// download
// delete
// favorite/unfavorite
// update info and chapters

class Library extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mangaInfo: {},
    };
  }

  componentDidMount() {
    const api = TWApi.init();

    const tempId = 177;

    api.Commands.MangaInfo.execute(
      (res) => {
        this.setState({ mangaInfo: res.content });
      },
      null,
      { mangaId: tempId },
    );
  }

  render() {
    const { mangaInfo } = this.state;

    return <div>{JSON.stringify(mangaInfo)}</div>;
  }
}

export default Library;
