// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import {
  selectFilteredSortedLibrary,
  selectIsLibraryLoading,
  selectUnread,
  fetchLibrary,
  fetchUnread,
  fetchLibraryFlags
} from "redux-ducks/library";
import { selectIsChaptersLoading } from "redux-ducks/chapters";
import LibraryHeader from "components/Library/LibraryHeader";
import MangaGrid from "components/MangaGrid";
import LibraryMangaCard from "components/Library/LibraryMangaCard";
import FullScreenLoading from "components/Loading/FullScreenLoading";

// TODO: no feedback of success/errors after clicking the library update button

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mangaLibrary = useSelector(state =>
    selectFilteredSortedLibrary(state, searchQuery)
  );
  const unread = useSelector(selectUnread);
  const libraryIsLoading = useSelector(selectIsLibraryLoading);
  const chaptersAreUpdating = useSelector(selectIsChaptersLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLibrary());
    dispatch(fetchUnread());
    dispatch(fetchLibraryFlags());
  }, [dispatch]);

  return (
    <>
      <Helmet title="Library - TachiWeb" />

      <LibraryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <MangaGrid
        mangaLibrary={mangaLibrary}
        cardComponent={<LibraryMangaCard unread={unread} />}
      />

      {(libraryIsLoading || chaptersAreUpdating) && <FullScreenLoading />}
    </>
  );
};

export default Library;
