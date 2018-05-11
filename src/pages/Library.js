import React, { Component } from 'react';
import LibraryHeader from 'components/LibraryHeader';
import MangaGrid from 'components/MangaGrid';
import LibraryMangaCard from 'components/LibraryMangaCard';

// TODO: sort/filter mangaLibrary

class Library extends Component {
  componentDidMount() {
    this.props.fetchLibrary();
  }

  render() {
    const { mangaLibrary } = this.props;

    return (
      <React.Fragment>
        <LibraryHeader />

        <MangaGrid mangaLibrary={mangaLibrary} cardComponent={<LibraryMangaCard />} />
      </React.Fragment>
    );
  }
}

export default Library;
