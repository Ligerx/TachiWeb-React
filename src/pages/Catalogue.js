// @flow
import React, { Component } from 'react';
import type { MangaType, ChapterType, FiltersType } from 'types';
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
import type { CatalogueContainerProps } from 'containers/CatalogueContainer';

// TODO: keep previous scroll position when going back from MangaInfo -> Catalogue
// TODO: actually split all of this up into components...
// TODO: maybe add text saying that there are no more pages to load?

class Catalogue extends Component<CatalogueContainerProps> {
  componentDidMount() {
    const {
      sources, sourceId, fetchSources, fetchCatalogue, fetchFilters, changeSourceId,
    } = this.props;

    // https://github.com/babel/babel/issues/2141
    // this is undefined in the promise, so manually bind this
    const that = this;

    // Only reload on component mount if it's missing data
    if (!sources.length || sourceId == null) {
      fetchSources().then(() => {
        changeSourceId(that.props.sources[0].id); // use the first available source
        fetchCatalogue();
        fetchFilters();
      });
    }

    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    // Debouncing the search text
    this.delayedSearch = debounce(() => {
      fetchCatalogue();
    }, 500);
  }

  componentWillUnmount() {
    // Clean up debouncing function
    this.delayedSearch.cancel();
  }

  delayedSearch = () => null; // Placeholder, this gets replaced in componentDidMount()

  handleSourceChange = (event: SyntheticEvent<HTMLLIElement>) => {
    // NOTE: Using LIElement because that's how my HTML is structured.
    //       Doubt it'll cause problems, but change this or the actual component if needed.
    const {
      sources, changeSourceId, resetCatalogue, fetchFilters, fetchCatalogue,
    } = this.props;

    const newSourceIndex = parseInt(event.currentTarget.dataset.value, 10);
    const newSourceId = sources[newSourceIndex].id;

    resetCatalogue();
    changeSourceId(newSourceId);
    fetchFilters(); // call before fetchCatalogue so filters don't get used between sources
    fetchCatalogue();
  };

  handleSearchChange = (event: SyntheticEvent<HTMLInputElement>) => {
    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.props.updateSearchQuery(event.currentTarget.value);
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

  handleLoadNextPage = () => {
    const {
      hasNextPage, fetchNextCataloguePage, catalogueIsLoading,
    } = this.props;

    if (hasNextPage && !catalogueIsLoading) {
      fetchNextCataloguePage();
    }
  };

  handleResetFilters = () => {
    this.props.resetFilters();
  };

  handleFilterChange = (newFilters: FiltersType) => {
    this.props.updateCurrentFilters(newFilters);
  };

  handleSearchFilters = () => {
    const { fetchCatalogue, updateLastUsedFilters } = this.props;

    updateLastUsedFilters(); // Must come before fetchCatalogue. This is a synchronous function.
    fetchCatalogue();
  };

  render() {
    const {
      mangaLibrary,
      sources,
      sourcesAreLoading,
      catalogueIsLoading,
      currentFilters,
      searchQuery,
      sourceId,
    } = this.props;

    return (
      <React.Fragment>
        <CatalogueHeader
          sourceId={sourceId}
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
          cardComponent={<CatalogueMangaCard />}
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
