import React, { Component } from 'react';
import TWApi from 'api';

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
