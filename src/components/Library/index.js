// @flow
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { Client } from "api";
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
import LibraryMangaCard from "components/Library/LibraryMangaCard";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import CategoriesTabs from "components/Library/CategoriesTabs";
import AppBar from "@material-ui/core/AppBar";
import LibraryDefaultToolbar from "components/Library/LibraryDefaultToolbar";
import LibraryHasSelectionsToolbar from "components/Library/LibraryHasSelectionsToolbar";
import EmptyState from "components/Library/EmptyState";
import { fetchSources } from "redux-ducks/sources/actionCreators";
import {
  selectIsCategoriesLoading,
  selectCategoriesIsLoaded
} from "redux-ducks/categories";
import { fetchCategories } from "redux-ducks/categories/actionCreators";

// TODO: no feedback of success/errors after clicking the library update button

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

type RouterProps = {
  match: {
    url: string
  }
};
type Props = RouterProps;

const Library = ({ match: { url } }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMangaIds, setSelectedMangaIds] = useState<number[]>([]);

  const mangaLibrary = useSelector(state =>
    selectFilteredSortedLibrary(state, searchQuery)
  );
  const unread = useSelector(selectUnread);
  const libraryIsLoading = useSelector(selectIsLibraryLoading);
  const chaptersAreUpdating = useSelector(selectIsChaptersLoading);
  const categoriesAreLoading = useSelector(selectIsCategoriesLoading);
  const categoriesIsLoaded = useSelector(selectCategoriesIsLoaded);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLibrary()).then(() => {
      dispatch(fetchUnread());
      dispatch(fetchCategories());
    });
    dispatch(fetchLibraryFlags());
    dispatch(fetchSources());
  }, [dispatch]);

  const handleSelectManga = (mangaId: number, isSelected: boolean) => {
    setSelectedMangaIds(prevState => {
      if (isSelected) {
        return [...prevState, mangaId];
      }
      return prevState.filter(id => id !== mangaId);
    });
  };

  return (
    <>
      <Helmet title="Library - TachiWeb" />

      <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
        {selectedMangaIds.length > 0 ? (
          <LibraryHasSelectionsToolbar
            selectedMangaIds={selectedMangaIds}
            deselectMangaIds={() => setSelectedMangaIds([])}
          />
        ) : (
          <LibraryDefaultToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}
        <CategoriesTabs />
      </AppBar>

      {/* Prevent library manga from flashing on screen before organizing them into categories */}
      {categoriesIsLoaded && (
        <Container>
          <Grid container spacing={2}>
            {mangaLibrary.map(manga => (
              <LibraryMangaCard
                key={manga.id}
                to={Client.manga(url, manga.id)}
                manga={manga}
                unread={unread[manga.id] || 0}
                isSelected={selectedMangaIds.includes(manga.id)}
                showSelectedCheckbox={selectedMangaIds.length > 0}
                onSelectedToggle={handleSelectManga}
              />
            ))}
          </Grid>
        </Container>
      )}

      {(libraryIsLoading || chaptersAreUpdating || categoriesAreLoading) && (
        <FullScreenLoading />
      )}

      <EmptyState />
    </>
  );
};

export default withRouter(Library);
