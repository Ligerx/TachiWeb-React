// @flow
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { Client } from "api";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import LibraryMangaCard from "components/Library/LibraryMangaCard";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import CategoriesTabs from "components/Library/CategoriesTabs";
import AppBar from "@material-ui/core/AppBar";
import LibraryDefaultToolbar from "components/Library/LibraryDefaultToolbar";
import LibraryHasSelectionsToolbar from "components/Library/LibraryHasSelectionsToolbar";
import EmptyState from "components/Library/EmptyState";
import {
  useCategories,
  useLibrary,
  useLibraryFlags,
  useSources
} from "apiHooks";
import type { LibraryManga } from "@tachiweb/api-client";
import { selectCurrentCategoryId } from "redux-ducks/categories";
import { useSelector } from "react-redux";
import { filterSortLibrary } from "./utils";

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

  const { data: categories } = useCategories();
  const { data: sources } = useSources();
  const { data: libraryFlags } = useLibraryFlags();
  const { data: notSortedOrFilteredLibraryMangas } = useLibrary();

  const currentCategoryId = useSelector(selectCurrentCategoryId);

  // update this function to be cleaner with the new swr hooks data
  // also need to update the render function
  const allDataLoaded =
    notSortedOrFilteredLibraryMangas != null &&
    categories != null &&
    libraryFlags != null &&
    sources != null;
  const libraryMangas: ?(LibraryManga[]) = allDataLoaded
    ? filterSortLibrary(
        notSortedOrFilteredLibraryMangas,
        categories.find(category => category.id === currentCategoryId),
        libraryFlags,
        sources,
        searchQuery
      )
    : null;

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
      {allDataLoaded && (
        <Container>
          <Grid container spacing={2}>
            {libraryMangas.map(libraryManga => (
              <LibraryMangaCard
                key={libraryManga.manga.id}
                to={Client.manga(url, libraryManga.manga.id)}
                manga={libraryManga.manga}
                unread={libraryManga.totalUnread}
                isSelected={selectedMangaIds.includes(libraryManga.manga.id)}
                showSelectedCheckbox={selectedMangaIds.length > 0}
                onSelectedToggle={handleSelectManga}
              />
            ))}
          </Grid>
        </Container>
      )}

      {!allDataLoaded && <FullScreenLoading />}

      {notSortedOrFilteredLibraryMangas != null &&
        notSortedOrFilteredLibraryMangas.length === 0 && <EmptyState />}
    </>
  );
};

export default withRouter(Library);
