// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import {
  selectFilteredSortedLibrary,
  selectIsLibraryLoading,
  selectUnread
} from "redux-ducks/library";
import {
  fetchLibrary,
  fetchUnread,
  fetchLibraryFlags
} from "redux-ducks/library/actionCreators";
import { selectIsChaptersLoading } from "redux-ducks/chapters";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import LibraryHeader from "components/Library/LibraryHeader";
import LibraryMangaCard from "components/Library/LibraryMangaCard";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import CategoriesTabs from "components/Library/CategoriesTabs";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import { selectIsCategoriesLoading } from "redux-ducks/categories";
import { fetchCategories } from "redux-ducks/categories/actionCreators";

// TODO: no feedback of success/errors after clicking the library update button

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManga, setSelectedManga] = useState<number[]>([]);

  const mangaLibrary = useSelector(state =>
    selectFilteredSortedLibrary(state, searchQuery)
  );
  const unread = useSelector(selectUnread);
  const libraryIsLoading = useSelector(selectIsLibraryLoading);
  const chaptersAreUpdating = useSelector(selectIsChaptersLoading);
  const categoriesAreLoading = useSelector(selectIsCategoriesLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLibrary()).then(() => dispatch(fetchUnread()));
    dispatch(fetchLibraryFlags());
    dispatch(fetchSources());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <Helmet title="Library - TachiWeb" />

      <LibraryHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedManga={selectedManga}
        setSelectedManga={setSelectedManga}
      >
        <CategoriesTabs />
      </LibraryHeader>

      <Container>
        <Grid container spacing={2}>
          {mangaLibrary.map(manga => (
            <LibraryMangaCard
              key={manga.id}
              manga={manga}
              unread={unread[manga.id] || 0}
            />
          ))}
        </Grid>
      </Container>

      {(libraryIsLoading || chaptersAreUpdating || categoriesAreLoading) && (
        <FullScreenLoading />
      )}
    </>
  );
};

export default Library;
