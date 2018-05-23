// @flow
import React, { Component } from 'react';
import LibraryHeader from 'components/LibraryHeader';
import MangaGrid from 'components/MangaGrid';
import LibraryMangaCard from 'components/LibraryMangaCard';
import FullScreenLoading from 'components/loading/FullScreenLoading';
import type { LibraryContainerProps } from 'containers/LibraryContainer';

// TODO: sort/filter mangaLibrary

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

class Library extends Component<LibraryContainerProps> {
  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchUnread();
  }

  handleRefreshClick = () => {
    this.props.fetchLibrary({ ignoreCache: true });
  };

  render() {
    const { mangaLibrary, unread, libraryIsLoading } = this.props;

    return (
      <React.Fragment>
        <LibraryHeader onRefreshClick={this.handleRefreshClick} />

        <MangaGrid
          mangaLibrary={mangaLibrary}
          cardComponent={<LibraryMangaCard unread={unread} />}
        />

        {libraryIsLoading && <FullScreenLoading />}
      </React.Fragment>
    );
  }
}

export default Library;
