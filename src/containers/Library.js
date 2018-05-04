import React, { Component } from 'react';
import LibraryHeader from 'components/LibraryHeader';
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
    TWApi.Commands.Library.execute((res) => {
      this.setState({ mangaLibrary: res.content });
    });
  }

  render() {
    const { mangaLibrary } = this.state;

    return (
      <React.Fragment>
        <LibraryHeader />

        <MangaGrid mangaLibrary={mangaLibrary} />
      </React.Fragment>
    );
  }
}

export default Library;
