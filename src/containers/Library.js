import React, { Component } from 'react';
import Header from 'components/Header';
import MangaGrid from 'components/MangaGrid';
import TWApi from 'api';

class Library extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mangaLibrary: [],
    };
  }

  componentDidMount() {
    const api = TWApi.init();

    api.Commands.Library.execute((res) => {
      this.setState({ mangaLibrary: res.content });
    });
  }

  render() {
    const { mangaLibrary } = this.state;

    return (
      <div>
        <Header />

        <MangaGrid mangaLibrary={mangaLibrary} />
      </div>
    );
  }
}

export default Library;
