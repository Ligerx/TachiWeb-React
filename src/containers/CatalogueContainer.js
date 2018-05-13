import { connect } from 'react-redux';
import { fetchSources } from 'redux-ducks/sources';
import { fetchCatalogue, fetchNextCataloguePage } from 'redux-ducks/catalogue';
import { fetchChapters } from 'redux-ducks/chapters';
import { toggleFavorite } from 'redux-ducks/library';
import Catalogue from 'pages/Catalogue';

const mapStateToProps = (state) => {
  const {
    mangaIds,
    page,
    hasNextPage,
    query,
    filters,
    isFetching: catalogueIsFetching,
  } = state.catalogue;
  const mangaLibrary = mangaToShow(state.library.mangaLibrary, mangaIds);

  return {
    // Sources props
    sources: state.sources.sourcesArray,
    // Catalogue props
    page,
    hasNextPage,
    query,
    filters,
    catalogueIsFetching,
    // Chapter props
    chaptersByMangaId: state.chapters.chaptersByMangaId,
    chaptersAreFetching: state.chapters.isFetching,
    // Library props
    mangaLibrary,
    isTogglingFavorite: state.library.isTogglingFavorite,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSources: () => dispatch(fetchSources()),
  // Passing in the new catalogue search settings
  fetchCatalogue: (sourceId, query, filters) => dispatch(fetchCatalogue(sourceId, query, filters)),
  fetchChapters: mangaId => dispatch(fetchChapters(mangaId)),
  // Need a nested function to pass in mangaId in the JSX
  toggleFavoriteForManga: (mangaId, isFavorite) => () =>
    dispatch(toggleFavorite(mangaId, isFavorite)),
  fetchNextCataloguePage: sourceId => dispatch(fetchNextCataloguePage(sourceId)),
});

// Helper functions
function mangaToShow(mangaLibrary, mangaIds) {
  return mangaLibrary.filter(manga => mangaIds.includes(manga.id));
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
