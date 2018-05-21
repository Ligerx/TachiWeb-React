import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mangaType } from 'types';
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

// TODO: sources type
// TODO: filter type?
// TODO: keep previous scroll position when going back from MangaInfo -> Catalogue
// TODO: if you're looking at a new manga, chapters won't have been scraped by the server yet.
//       Need to force an update when it's empty?
//       This is probably also an issue w/ library.
// TODO: actually split all of this up into components...
// TODO: maybe add text saying that there are no more pages to load?

class Catalogue extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // Keep two copies of 'filters' in state
    // cloneDeep should be done by the methods that setState
    const filtersAreNull = !prevState.currentFilters || !prevState.lastUsedFilters;

    if (filtersAreNull && nextProps.initialFilters && nextProps.initialFilters.length > 0) {
      return {
        ...prevState,
        lastUsedFilters: nextProps.initialFilters,
        currentFilters: nextProps.initialFilters,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      // Select based on index of the array instead of id
      // this makes it less reliant on having to sync state with the data
      sourceIndex: 0,
      searchQuery: '',
      lastUsedFilters: null, // use this for any searches
      currentFilters: null, // temporarily store user changes, use to overwrite lastUsedFilters
      mangaIdBeingViewed: null,
    };

    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleMangaInfoBackClick = this.handleMangaInfoBackClick.bind(this);
    this.handleLoadNextPage = this.handleLoadNextPage.bind(this);
    this.handleResetFilters = this.handleResetFilters.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSearchFilters = this.handleSearchFilters.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
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

  componentDidUpdate(prevProps, prevState) {
    const { sourceIndex } = this.state;
    const { sources, fetchCatalogue, fetchFilters } = this.props;

    if (sourceIndex !== prevState.sourceIndex) {
      this.setState({ lastUsedFilters: null, currentFilters: null }); /* eslint-disable-line */
      fetchCatalogue(sources[sourceIndex].id);
      fetchFilters(sources[sourceIndex].id);
    }
  }

  componentWillUnmount() {
    // Clean up debouncing function
    this.delayedSearch.cancel();
  }

  handleSourceChange(event) {
    this.setState({ sourceIndex: event.target.value, searchQuery: '' });
  }

  handleSearchChange(event) {
    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.setState({ searchQuery: event.target.value });
    this.delayedSearch();
  }

  handleCardClick(mangaId) {
    return () => {
      this.setState({ mangaIdBeingViewed: mangaId });

      // Fetch chapters cached on server
      // If there are none, tell server to scrape the site
      this.props.fetchChapters(mangaId)
        .then(() => {
          const chapters = this.props.chaptersByMangaId[mangaId];
          if (chapters && chapters.length <= 0) {
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
      const thisManga = this.props.mangaLibrary.find(manga => manga.id === mangaId);
      if (possiblyMissingInfo(thisManga)) {
        setTimeout(() => {
          this.props.fetchMangaInfo(mangaId);
        }, 300);
      }
    };
  }

  handleMangaInfoBackClick() {
    this.setState({ mangaIdBeingViewed: null });
  }

  handleLoadNextPage() {
    const {
      hasNextPage, sources, fetchNextCataloguePage, catalogueIsLoading,
    } = this.props;
    const { searchQuery, lastUsedFilters, sourceIndex } = this.state;

    if (hasNextPage && !catalogueIsLoading) {
      fetchNextCataloguePage(sources[sourceIndex].id, searchQuery, lastUsedFilters);
    }
  }

  handleResetFilters() {
    const { initialFilters } = this.props;
    this.setState({ lastUsedFilters: initialFilters, currentFilters: initialFilters });
  }

  handleFilterChange(newFilters) {
    this.setState({ currentFilters: newFilters });
  }

  handleSearchFilters() {
    const { fetchCatalogue, sources } = this.props;
    const { sourceIndex, searchQuery, currentFilters } = this.state;

    fetchCatalogue(sources[sourceIndex].id, searchQuery, currentFilters, { retainFilters: true });
    this.setState({ lastUsedFilters: currentFilters });
  }

  handleRefreshClick() {
    this.props.updateMangaInfo(this.state.mangaIdBeingViewed);
    this.props.updateChapters(this.state.mangaIdBeingViewed);
  }

  render() {
    const {
      mangaLibrary,
      sources,
      chaptersByMangaId,
      favoriteIsToggling,
      toggleFavoriteForManga,
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

    const mangaInfo = mangaLibrary.find(manga => manga.id === mangaIdBeingViewed);
    const chapters = chaptersByMangaId[mangaIdBeingViewed];
    const toggleFavorite = mangaInfo ?
      toggleFavoriteForManga(mangaInfo.id, mangaInfo.favorite) : () => null;

    if (mangaIdBeingViewed) {
      return (
        <MangaInfo
          mangaInfo={mangaInfo}
          chapters={chapters}
          initialTabValue={0}
          onBackClick={this.handleMangaInfoBackClick}
          onRefreshClick={this.handleRefreshClick}
          favoriteIsToggling={favoriteIsToggling}
          toggleFavorite={toggleFavorite}
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
function possiblyMissingInfo(manga) {
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

Catalogue.propTypes = {
  mangaLibrary: PropTypes.arrayOf(mangaType),
  sources: PropTypes.array, // TODO: type
  hasNextPage: PropTypes.bool.isRequired,
  initialFilters: PropTypes.array, // TODO: type
  // TODO: chaptersByMangaId has dynamic keys, so I'm not writing a custom validator right now
  chaptersByMangaId: PropTypes.object.isRequired,
  sourcesAreLoading: PropTypes.bool.isRequired,
  favoriteIsToggling: PropTypes.bool.isRequired,
  catalogueIsLoading: PropTypes.bool.isRequired,
  mangaInfoIsLoading: PropTypes.bool.isRequired,
  // Below are redux dispatch functions
  fetchSources: PropTypes.func.isRequired,
  fetchCatalogue: PropTypes.func.isRequired,
  fetchFilters: PropTypes.func.isRequired,
  fetchNextCataloguePage: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
  toggleFavoriteForManga: PropTypes.func.isRequired,
  updateChapters: PropTypes.func.isRequired,
  updateMangaInfo: PropTypes.func.isRequired,
  fetchMangaInfo: PropTypes.func.isRequired,
};

Catalogue.defaultProps = {
  mangaLibrary: null,
  sources: null,
  initialFilters: null,
};

export default Catalogue;
