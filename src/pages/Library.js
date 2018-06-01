// @flow
import React, { Component } from 'react';
import LibraryHeader from 'components/LibraryHeader';
import MangaGrid from 'components/MangaGrid';
import LibraryMangaCard from 'components/LibraryMangaCard';
import FullScreenLoading from 'components/loading/FullScreenLoading';
import type { LibraryContainerProps } from 'containers/LibraryContainer';

// TODO: sort/filter mangaLibrary

// TODO: no feedback of success/errors after clicking the library update button

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

class Library extends Component<LibraryContainerProps> {
  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchUnread();
  }

  handleRefreshClick = () => {
    const {
      mangaLibrary, updateChapters, fetchLibrary, fetchUnread,
    } = this.props;

    // Create an array of promise functions
    // Since calling updateChapters runs the function, create an intermediate function
    const updateChapterPromises = mangaLibrary.map(mangaInfo => () => updateChapters(mangaInfo.id));

    serialPromiseChain(updateChapterPromises)
      .then(() => fetchLibrary({ ignoreCache: true }))
      .then(() => fetchUnread({ ignoreCache: true }));
  };

  render() {
    const {
      mangaLibrary, unread, libraryIsLoading, chaptersAreUpdating,
    } = this.props;

    return (
      <React.Fragment>
        <LibraryHeader onRefreshClick={this.handleRefreshClick} />

        <MangaGrid
          mangaLibrary={mangaLibrary}
          cardComponent={<LibraryMangaCard unread={unread} />}
        />

        {(libraryIsLoading || chaptersAreUpdating) && <FullScreenLoading />}
      </React.Fragment>
    );
  }
}

// Helper Functions
// https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
function serialPromiseChain(promiseArray) {
  return promiseArray.reduce(
    (promiseChain, currentPromise) => promiseChain.then(() => currentPromise()),
    Promise.resolve([]),
  );
}

export default Library;
