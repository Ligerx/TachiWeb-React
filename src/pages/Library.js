// @flow
import React, { Component } from "react";
import LibraryHeader from "components/library/LibraryHeader";
import MangaGrid from "components/MangaGrid";
import LibraryMangaCard from "components/library/LibraryMangaCard";
import FullScreenLoading from "components/loading/FullScreenLoading";
import type { LibraryContainerProps } from "containers/LibraryContainer";
import { Helmet } from "react-helmet";
import filterSortLibrary from "components/library/libraryUtils";

// TODO: no feedback of success/errors after clicking the library update button

// FIXME: LibraryMangaCard - unread badge is positioning too far right. This is causing
//        library to have an x-overflow

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

type State = { searchQuery: string };

class Library extends Component<LibraryContainerProps, State> {
  state = { searchQuery: "" };

  componentDidMount() {
    const {
      fetchLibrary,
      fetchUnread,
      fetchLibraryFlags,
      fetchSources
    } = this.props;
    // Fetch unread after library as fetching the library may have
    //   already loaded the unread
    fetchLibrary().then(() => fetchUnread());
    fetchLibraryFlags();
    fetchSources();
  }

  handleRefreshClick = () => {
    const { mangaLibrary, updateChapters, fetchLibrary } = this.props;

    // Create an array of promise functions
    // Since calling updateChapters runs the function, create an intermediate function
    const updateChapterPromises = mangaLibrary.map(mangaInfo => () =>
      updateChapters(mangaInfo.id)
    );

    serialPromiseChain(updateChapterPromises).then(() =>
      // Will always load the unread if ignoring the cache, so no need to call
      //   fetchUnread
      fetchLibrary({ ignoreCache: true })
    );
  };

  handleSearchChange = (newSearchQuery: string) => {
    this.setState({ searchQuery: newSearchQuery });
  };

  render() {
    const {
      mangaLibrary,
      sources,
      unread,
      downloaded,
      totalChaptersSortIndexes,
      lastReadSortIndexes,
      flags,
      setLibraryFlag,
      libraryIsLoading,
      chaptersAreUpdating
    } = this.props;

    const { searchQuery } = this.state;

    const filteredSortedLibrary = filterSortLibrary(
      mangaLibrary,
      flags,
      sources,
      unread,
      downloaded,
      totalChaptersSortIndexes,
      lastReadSortIndexes,
      searchQuery
    );

    return (
      <React.Fragment>
        <Helmet>
          <title>Library - TachiWeb</title>
        </Helmet>

        <LibraryHeader
          searchQuery={searchQuery}
          flags={flags}
          onSearchChange={this.handleSearchChange}
          onRefreshClick={this.handleRefreshClick}
          setLibraryFlag={setLibraryFlag}
        />

        <MangaGrid
          mangaLibrary={filteredSortedLibrary}
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
    Promise.resolve([])
  );
}

export default Library;
