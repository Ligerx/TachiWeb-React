import React, { Component } from 'react';
import Header from 'components/Header';
import MangaGrid from 'components/MangaGrid';

class Library extends Component {
  render() {
    return (
      <div>
        <Header />

        <MangaGrid />
      </div>
    );
  }
}

export default Library;
