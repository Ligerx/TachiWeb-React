import { connect } from 'react-redux';
import { fetchSources, FETCH_SOURCES } from 'redux-ducks/sources';
import {
  fetchCatalogue,
  fetchNextCataloguePage,
  FETCH_CATALOGUE,
  CATALOGUE_ADD_PAGE,
} from 'redux-ducks/catalogue';
import {
  fetchChapters,
  updateChapters,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS,
} from 'redux-ducks/chapters';
import { fetchFilters } from 'redux-ducks/filters';
import { fetchMangaInfo, updateMangaInfo, FETCH_MANGA, UPDATE_MANGA } from 'redux-ducks/mangaInfos';
import Catalogue from 'pages/Catalogue';
import { createLoadingSelector } from 'redux-ducks/loading';

const sourcesAreLoading = createLoadingSelector([FETCH_SOURCES]);
const catalogueIsLoading = createLoadingSelector([FETCH_CATALOGUE, CATALOGUE_ADD_PAGE]);
const mangaInfoIsLoading = createLoadingSelector([
  FETCH_MANGA,
  UPDATE_MANGA,
  FETCH_CHAPTERS,
  UPDATE_CHAPTERS,
]);

const mapStateToProps = (state) => {
  const { mangaIds, hasNextPage } = state.catalogue;
  const mangaLibrary = mangaToShow(state.mangaInfos, mangaIds);

  return {
    // Sources props
    sources: state.sources,
    // Catalogue props
    hasNextPage,
    // Chapter props
    chaptersByMangaId: state.chapters,
    // Library props
    mangaLibrary,
    // Filter props
    initialFilters: state.filters,
    // Fetching props
    sourcesAreLoading: sourcesAreLoading(state),
    catalogueIsLoading: catalogueIsLoading(state),
    mangaInfoIsLoading: mangaInfoIsLoading(state),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSources: () => dispatch(fetchSources()),
  // Passing in the new catalogue search settings
  fetchCatalogue: (sourceId, query, filters, retainFilters) =>
    dispatch(fetchCatalogue(sourceId, query, filters, retainFilters)),
  fetchFilters: sourceId => dispatch(fetchFilters(sourceId)),
  fetchChapters: mangaId => dispatch(fetchChapters(mangaId)),
  fetchNextCataloguePage: (sourceId, query, filters) =>
    dispatch(fetchNextCataloguePage(sourceId, query, filters)),
  updateChapters: mangaId => dispatch(updateChapters(mangaId)),
  updateMangaInfo: mangaId => dispatch(updateMangaInfo(mangaId)),
  fetchMangaInfo: mangaId => dispatch(fetchMangaInfo(mangaId)),
});

// Helper functions
function mangaToShow(mangaLibrary, mangaIds) {
  return mangaIds.map(mangaId => mangaLibrary[mangaId]);
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
