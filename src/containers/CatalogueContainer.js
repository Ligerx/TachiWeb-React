// @flow
import { connect } from "react-redux";
import {
  selectIsSourcesLoading,
  selectSources,
  fetchSources
} from "redux-ducks/sources";
import {
  selectIsCatalogueLoading,
  selectCatalogueSourceId,
  selectCatalogueHasNextPage,
  selectCatalogueSearchQuery,
  selectCatalogueMangaInfos,
  fetchCatalogue,
  fetchNextCataloguePage,
  resetCatalogue,
  updateSearchQuery,
  changeSourceId
} from "redux-ducks/catalogue";
import {
  selectChapter,
  fetchChapters,
  updateChapters
} from "redux-ducks/chapters";
import {
  selectInitialFilters,
  selectLastUsedFilters,
  selectCurrentFilters,
  fetchFilters,
  resetFilters,
  updateLastUsedFilters,
  updateCurrentFilters
} from "redux-ducks/filters";
import { fetchMangaInfo, updateMangaInfo } from "redux-ducks/mangaInfos";
import Catalogue from "pages/Catalogue";
import type { SourceType, ChapterType, MangaType } from "types";
import type { FilterAnyType } from "types/filters";

type StateToProps = {
  sources: Array<SourceType>,

  hasNextPage: boolean,
  searchQuery: string,
  sourceId: ?string,

  chaptersByMangaId: { [mangaId: number]: Array<ChapterType> },
  mangaLibrary: Array<MangaType>,

  initialFilters: Array<FilterAnyType>,
  lastUsedFilters: Array<FilterAnyType>,
  currentFilters: Array<FilterAnyType>,

  sourcesAreLoading: boolean,
  catalogueIsLoading: boolean
};

const mapStateToProps = (state): StateToProps => {
  return {
    // Sources props
    sources: selectSources(state),
    // Catalogue props
    hasNextPage: selectCatalogueHasNextPage(state),
    searchQuery: selectCatalogueSearchQuery(state),
    sourceId: selectCatalogueSourceId(state),
    // Chapter props
    chaptersByMangaId: selectChapter(state),
    // Library props
    mangaLibrary: selectCatalogueMangaInfos(state),
    // Filter props
    initialFilters: selectInitialFilters(state),
    lastUsedFilters: selectLastUsedFilters(state),
    currentFilters: selectCurrentFilters(state),
    // Fetching props
    sourcesAreLoading: selectIsSourcesLoading(state),
    catalogueIsLoading: selectIsCatalogueLoading(state)
  };
};

type DispatchToProps = {
  fetchSources: Function,
  fetchCatalogue: Function,
  fetchNextCataloguePage: Function,
  resetCatalogue: Function,
  updateSearchQuery: Function,
  changeSourceId: Function,

  fetchChapters: Function,
  updateChapters: Function,
  updateMangaInfo: Function,
  fetchMangaInfo: Function,

  fetchFilters: Function,
  resetFilters: Function,
  updateLastUsedFilters: Function,
  updateCurrentFilters: Function
};

const mapDispatchToProps = (dispatch): DispatchToProps => ({
  fetchSources: () => dispatch(fetchSources()),
  // Passing in the new catalogue search settings
  fetchCatalogue: () => dispatch(fetchCatalogue()),
  fetchNextCataloguePage: () => dispatch(fetchNextCataloguePage()),
  resetCatalogue: () => dispatch(resetCatalogue()),
  updateSearchQuery: newSearchQuery =>
    dispatch(updateSearchQuery(newSearchQuery)),
  changeSourceId: newSourceId => dispatch(changeSourceId(newSourceId)),

  fetchChapters: mangaId => dispatch(fetchChapters(mangaId)),
  updateChapters: mangaId => dispatch(updateChapters(mangaId)),
  updateMangaInfo: mangaId => dispatch(updateMangaInfo(mangaId)),
  fetchMangaInfo: mangaId => dispatch(fetchMangaInfo(mangaId)),

  fetchFilters: () => dispatch(fetchFilters()),
  resetFilters: () => dispatch(resetFilters()),
  updateLastUsedFilters: () => dispatch(updateLastUsedFilters()),
  updateCurrentFilters: newFilters => dispatch(updateCurrentFilters(newFilters))
});

export type CatalogueContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Catalogue);
