import React, { Component } from 'react';
import LibraryHeader from 'components/LibraryHeader';
import MangaGrid from 'components/MangaGrid';

class Library extends Component {
  componentDidMount() {
    this.props.fetchLibrary();
  }

  render() {
    const { mangaLibrary } = this.props;

    return (
      <React.Fragment>
        <LibraryHeader />

        <MangaGrid mangaLibrary={mangaLibrary} />
      </React.Fragment>
    );
  }
}

export default Library;
