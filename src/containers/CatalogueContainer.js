import { connect } from 'react-redux';
import { fetchSources } from 'redux-ducks/sources';
import {
  fetchCatalogue,
  fetchNextCataloguePage,
  CATALOGUE_LOAD_ACTION,
  CATALOGUE_ADD_PAGE_ACTION,
} from 'redux-ducks/catalogue';
import { fetchChapters, updateChapters } from 'redux-ducks/chapters';
import { toggleFavorite, updateMangaInfo } from 'redux-ducks/library';
import { fetchFilters } from 'redux-ducks/filters';
import Catalogue from 'pages/Catalogue';
import { createLoadingSelector } from 'redux-ducks/loading';

const catalogueLoading = createLoadingSelector([CATALOGUE_LOAD_ACTION]);
const catalogueAddPageLoading = createLoadingSelector([CATALOGUE_ADD_PAGE_ACTION]);

const mapStateToProps = (state) => {
  const { mangaIds, hasNextPage } = state.catalogue;
  const mangaLibrary = mangaToShow(state.mangaInfo, mangaIds);

  return {
    // Sources props
    sources: state.sources,
    // Catalogue props
    hasNextPage,
    // Chapter props
    chaptersByMangaId: state.chapters,
    // Library props
    mangaLibrary,
    isTogglingFavorite: state.library.isTogglingFavorite,
    // Filter props
    initialFilters: state.filters,
    // Fetching props
    catalogueIsLoading: catalogueLoading(state),
    addPageIsLoading: catalogueAddPageLoading(state),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSources: () => dispatch(fetchSources()),
  // Passing in the new catalogue search settings
  fetchCatalogue: (sourceId, query, filters, retainFilters) =>
    dispatch(fetchCatalogue(sourceId, query, filters, retainFilters)),
  fetchFilters: sourceId => dispatch(fetchFilters(sourceId)),
  fetchChapters: mangaId => dispatch(fetchChapters(mangaId)),
  // Need a nested function to pass in mangaId in the JSX
  toggleFavoriteForManga: (mangaId, isFavorite) => () =>
    dispatch(toggleFavorite(mangaId, isFavorite)),
  fetchNextCataloguePage: (sourceId, query, filters) =>
    dispatch(fetchNextCataloguePage(sourceId, query, filters)),
  updateChapters: mangaId => dispatch(updateChapters(mangaId)),
  updateMangaInfo: mangaId => dispatch(updateMangaInfo(mangaId)),
});

// Helper functions
function mangaToShow(mangaLibrary, mangaIds) {
  return mangaIds.map(mangaId => mangaLibrary[mangaId]);
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
