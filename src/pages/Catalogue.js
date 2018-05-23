// @flow
import React, { Component } from 'react';
import type { MangaType, SourceType, ChapterType, FiltersType } from 'types';
import MangaInfo from 'components/MangaInfo';
import debounce from 'lodash/debounce';
import MangaGrid from 'components/MangaGrid';
import CatalogueMangaCard from 'components/CatalogueMangaCard';
import Waypoint from 'react-waypoint';
import DynamicSourceFilters from 'components/filters/DynamicSourceFilters';
import ResponsiveGrid from 'components/ResponsiveGrid';
import CatalogueHeader from 'components/CatalogueHeader';
import CenteredLoading from 'components/loading/CenteredLoading';
import FullScreenLoading from 'components/loading/FullScreenLoading';

// TODO: keep previous scroll position when going back from MangaInfo -> Catalogue
// TODO: actually split all of this up into components...
// TODO: maybe add text saying that there are no more pages to load?

type Props = {
  mangaLibrary: Array<MangaType>,
  sources: Array<SourceType>,
  hasNextPage: boolean,
  initialFilters: FiltersType,
  chaptersByMangaId: { [mangaId: number]: Array<ChapterType> },
  sourcesAreLoading: boolean,
  catalogueIsLoading: boolean,
  mangaInfoIsLoading: boolean,
  // Below are redux dispatch functions
  fetchSources: Function,
  fetchCatalogue: Function,
  fetchFilters: Function,
  fetchNextCataloguePage: Function,
  fetchChapters: Function,
  updateChapters: Function,
  updateMangaInfo: Function,
  fetchMangaInfo: Function,
};

type State = {
  // Select based on index of the array instead of id
  // this makes it less reliant on having to sync state with the data
  // May change this in the future?
  sourceIndex: number,
  searchQuery: string,
  lastUsedFilters: FiltersType, // use this for any searches
  currentFilters: FiltersType, // temporarily store user changes, use to overwrite lastUsedFilters
  mangaIdBeingViewed: ?number,
};

class Catalogue extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    // Keep two copies of 'filters' in state
    // cloneDeep should be done by the methods that setState
    const filtersAreEmpty: boolean =
      !prevState.currentFilters.length || !prevState.lastUsedFilters.length;

    if (filtersAreEmpty && nextProps.initialFilters.length) {
      return {
        ...prevState,
        lastUsedFilters: nextProps.initialFilters,
        currentFilters: nextProps.initialFilters,
      };
    }
    return null;
  }

  state = {
    sourceIndex: 0,
    searchQuery: '',
    lastUsedFilters: [],
    currentFilters: [],
    mangaIdBeingViewed: null,
  }

  componentDidMount() {
    const { fetchSources, fetchCatalogue, fetchFilters } = this.props;

    // I think there's a bug in babel. I should be able to reference 'this' (in the outer scope)
    // when using an arrow function, but it's undefined. So I'm manually binding 'this'.
    const that = this;
    fetchSources().then(() => {
      fetchCatalogue(that.props.sources[0].id);
      fetchFilters(that.props.sources[0].id);
    });

    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    // Debouncing the search text
    this.delayedSearch = debounce(() => {
      const { sourceIndex, searchQuery, lastUsedFilters } = this.state;
      fetchCatalogue(this.props.sources[sourceIndex].id, searchQuery, lastUsedFilters, {
        retainFilters: true,
      });
    }, 500);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { sourceIndex } = this.state;
    const { sources, fetchCatalogue, fetchFilters } = this.props;

    if (sourceIndex !== prevState.sourceIndex) {
      this.setState({ lastUsedFilters: [], currentFilters: [] }); /* eslint-disable-line */
      fetchCatalogue(sources[sourceIndex].id);
      fetchFilters(sources[sourceIndex].id);
    }
  }

  componentWillUnmount() {
    // Clean up debouncing function
    this.delayedSearch.cancel();
  }

  handleSourceChange = (event) => {
    this.setState({ sourceIndex: event.target.value, searchQuery: '' });
  };

  handleSearchChange = (event) => {
    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.setState({ searchQuery: event.target.value });
    this.delayedSearch();
  };

  handleCardClick = (mangaId: number) => () => {
    this.setState({ mangaIdBeingViewed: mangaId });

    // Fetch chapters cached on server
    // If there are none, tell server to scrape the site
    this.props.fetchChapters(mangaId)
      .then(() => {
        const chapters: Array<ChapterType> = this.props.chaptersByMangaId[mangaId] || [];
        if (!chapters.length) {
          this.props.updateChapters(mangaId);
        }
      });

    // If we think the server hasn't had enough time to scrape the source website
    // for this mangaInfo, wait a little while and try fetching again.
    //
    // NOTE: This only updates the manga being viewed. Many of your other search results are
    //       likely missing information as well. Viewing them will then fetch the data.
    //
    // TODO: might try to do one additional fetch at a slightly later time. e.g. 1000 ms
    const thisManga: ?MangaType = this.props.mangaLibrary.find(manga => manga.id === mangaId);
    if (thisManga && possiblyMissingInfo(thisManga)) {
      setTimeout(() => {
        this.props.fetchMangaInfo(mangaId);
      }, 300);
    }
  };

  handleMangaInfoBackClick = () => {
    this.setState({ mangaIdBeingViewed: null });
  };

  handleLoadNextPage = () => {
    const {
      hasNextPage, sources, fetchNextCataloguePage, catalogueIsLoading,
    } = this.props;
    const { searchQuery, lastUsedFilters, sourceIndex } = this.state;

    if (hasNextPage && !catalogueIsLoading) {
      fetchNextCataloguePage(sources[sourceIndex].id, searchQuery, lastUsedFilters);
    }
  };

  handleResetFilters = () => {
    const { initialFilters } = this.props;
    this.setState({ lastUsedFilters: initialFilters, currentFilters: initialFilters });
  };

  handleFilterChange = (newFilters: FiltersType) => {
    this.setState({ currentFilters: newFilters });
  };

  handleSearchFilters = () => {
    const { fetchCatalogue, sources } = this.props;
    const { sourceIndex, searchQuery, currentFilters } = this.state;

    fetchCatalogue(sources[sourceIndex].id, searchQuery, currentFilters, { retainFilters: true });
    this.setState({ lastUsedFilters: currentFilters });
  };

  handleRefreshClick = () => {
    this.props.updateMangaInfo(this.state.mangaIdBeingViewed);
    this.props.updateChapters(this.state.mangaIdBeingViewed);
  };

  render() {
    const {
      mangaLibrary,
      sources,
      chaptersByMangaId,
      sourcesAreLoading,
      catalogueIsLoading,
      mangaInfoIsLoading,
    } = this.props;
    const {
      mangaIdBeingViewed,
      sourceIndex,
      currentFilters,
      searchQuery,
    } = this.state;

    const mangaInfo: ?MangaType = mangaLibrary.find(manga => manga.id === mangaIdBeingViewed);
    // TODO: kind of annoying to type check 'chapters' right now.
    const chapters: Array<ChapterType> = chaptersByMangaId[mangaIdBeingViewed] || [];

    if (mangaIdBeingViewed) {
      return (
        <MangaInfo
          mangaInfo={mangaInfo}
          chapters={chapters}
          initialTabValue={0}
          onBackClick={this.handleMangaInfoBackClick}
          onRefreshClick={this.handleRefreshClick}
          isLoading={mangaInfoIsLoading}
        />
      );
    }

    return (
      <React.Fragment>
        <CatalogueHeader
          sourceIndex={sourceIndex}
          sources={sources}
          searchQuery={searchQuery}
          onSourceChange={this.handleSourceChange}
          onSearchChange={this.handleSearchChange}
        />

        <ResponsiveGrid>
          <DynamicSourceFilters
            filters={currentFilters}
            onResetClick={this.handleResetFilters}
            onSearchClick={this.handleSearchFilters}
            onFilterChange={this.handleFilterChange}
          />
        </ResponsiveGrid>

        <MangaGrid
          mangaLibrary={mangaLibrary}
          cardComponent={<CatalogueMangaCard onClick={this.handleCardClick} />}
        />
        {mangaLibrary.length > 0 && (
          <Waypoint onEnter={this.handleLoadNextPage} bottomOffset={-300} />
        )}

        {catalogueIsLoading && <CenteredLoading />}
        {sourcesAreLoading && <FullScreenLoading />}
      </React.Fragment>
    );
  }
}

// Helper methods
function possiblyMissingInfo(manga: MangaType): boolean {
  // mangaFields is an array of some values that mangaInfo should probably have
  // Count the number of these fields that are missing
  const mangaFields = ['author', 'description', 'genres', 'categories'];

  const numMissing = mangaFields.reduce(((counter, field) => {
    const value = manga[field];

    if (!value || (Array.isArray(value) && !value.length)) {
      return counter + 1;
    }
    return counter;
  }), 0);

  // setting the arbitrary amount of missing info at 3 to be considered missing info
  return numMissing >= 3;
}

export default Catalogue;
