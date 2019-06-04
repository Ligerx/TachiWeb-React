// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import {
  selectIsLibraryLoading,
  selectUnread,
  selectLibraryFlags,
  selectLibraryMangaInfos,
  fetchLibrary,
  fetchUnread,
  fetchLibraryFlags,
  setLibraryFlag
} from "redux-ducks/library";
import { selectIsChaptersLoading, updateChapters } from "redux-ducks/chapters";
import LibraryHeader from "components/Library/LibraryHeader";
import MangaGrid from "components/MangaGrid";
import LibraryMangaCard from "components/Library/LibraryMangaCard";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import filterSortLibrary from "components/Library/libraryUtils";

// TODO: no feedback of success/errors after clicking the library update button

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mangaLibrary = useSelector(selectLibraryMangaInfos);
  const unread = useSelector(selectUnread);
  const flags = useSelector(selectLibraryFlags);
  const libraryIsLoading = useSelector(selectIsLibraryLoading);
  const chaptersAreUpdating = useSelector(selectIsChaptersLoading);

  const dispatch = useDispatch();

  const handleSetLibraryFlag = (flag, state) =>
    dispatch(setLibraryFlag(flag, state));

  useEffect(() => {
    dispatch(fetchLibrary());
    dispatch(fetchUnread());
    dispatch(fetchLibraryFlags());
  }, [dispatch]);

  const handleRefreshClick = () => {
    // Create an array of promise functions
    // Since calling updateChapters runs the function, create an intermediate function
    const updateChapterPromises = mangaLibrary.map(mangaInfo => () =>
      dispatch(updateChapters(mangaInfo.id))
    );

    serialPromiseChain(updateChapterPromises)
      .then(() => dispatch(fetchLibrary({ ignoreCache: true })))
      .then(() => dispatch(fetchUnread({ ignoreCache: true })));
  };

  const handleSearchChange = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
  };

  const filteredSortedLibrary = filterSortLibrary(
    mangaLibrary,
    flags,
    unread,
    searchQuery
  );

  return (
    <React.Fragment>
      <Helmet title="Library - TachiWeb" />

      <LibraryHeader
        searchQuery={searchQuery}
        flags={flags}
        onSearchChange={handleSearchChange}
        onRefreshClick={handleRefreshClick}
        setLibraryFlag={handleSetLibraryFlag}
      />

      <MangaGrid
        mangaLibrary={filteredSortedLibrary}
        cardComponent={<LibraryMangaCard unread={unread} />}
      />

      {(libraryIsLoading || chaptersAreUpdating) && <FullScreenLoading />}
    </React.Fragment>
  );
};

// Helper Functions
// https://decembersoft.com/posts/promises-in-serial-with-array-reduce/
function serialPromiseChain(promiseArray) {
  return promiseArray.reduce(
    (promiseChain, currentPromise) => promiseChain.then(() => currentPromise()),
    Promise.resolve([])
  );
}

export default Library;
