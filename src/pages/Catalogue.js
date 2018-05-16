import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mangaType } from 'types';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import MangaInfo from 'components/MangaInfo';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import MenuDrawer from 'components/MenuDrawer';
import TextField from 'material-ui/TextField';
import debounce from 'lodash/debounce';
import MangaGrid from 'components/MangaGrid';
import CatalogueMangaCard from 'components/CatalogueMangaCard';
import Waypoint from 'react-waypoint';
import { CircularProgress } from 'material-ui/Progress';
import DynamicSourceFilters from 'components/filters/DynamicSourceFilters';
import ResponsiveGrid from 'components/ResponsiveGrid';
import cloneDeep from 'lodash/cloneDeep';

// TODO: sources type
// TODO: filter type?
// TODO: keep previous scroll position when going back from MangaInfo -> Catalogue
// TODO: if you're looking at a new manga, chapters won't have been scraped by the server yet.
//       Need to force an update when it's empty?
//       This is probably also an issue w/ library.
// TODO: actually split all of this up into components...

// FIXME: There are 3 types of filters
//     1. initial filters from the server
//     2. last searched filters
//     3. currently editing filters
// I need to account for #2
// Otherwise if you change the searchQuery while having 'unsaved' filter changes,
// the filters will use those unsaved changes anyway.

class Catalogue extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    // Use a clone of the initialFilters for easier updates
    if (!prevState.filters && nextProps.initialFilters && nextProps.initialFilters.length > 0) {
      return {
        ...prevState,
        filters: cloneDeep(nextProps.initialFilters),
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
      filters: null,
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
      const { sourceIndex, searchQuery, filters } = this.state;
      fetchCatalogue(this.props.sources[sourceIndex].id, searchQuery, filters, {
        retainFilters: true,
      });
    }, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    const { sourceIndex } = this.state;
    const { sources, fetchCatalogue, fetchFilters } = this.props;

    if (sourceIndex !== prevState.sourceIndex) {
      this.setState({ filters: null });
      fetchCatalogue(sources[sourceIndex].id);
      fetchFilters(sources[sourceIndex].id);
    }
  }

  componentWillUnmount() {
    // Clean up debouncing function
    this.delayedSearch.cancel();
  }

  handleSourceChange(event) {
    // TODO: not sure if setting 'filter: null' is correct right now
    this.setState({ sourceIndex: event.target.value, searchQuery: '' });
  }

  handleSearchChange(event) {
    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    this.setState({ searchQuery: event.target.value });
    this.delayedSearch();
  }

  handleCardClick(mangaId) {
    return () => {
      this.props.fetchChapters(mangaId);
      this.setState({ mangaIdBeingViewed: mangaId });
    };
  }

  handleMangaInfoBackClick() {
    this.setState({ mangaIdBeingViewed: null });
  }

  handleLoadNextPage() {
    // TODO: maybe add text saying that there are no more results?
    const { hasNextPage, sources, fetchNextCataloguePage } = this.props;
    const { searchQuery, filters, sourceIndex } = this.state;

    if (hasNextPage) {
      fetchNextCataloguePage(sources[sourceIndex].id, searchQuery, filters);
    }
  }

  handleResetFilters() {
    this.setState({ filters: this.props.initialFilters });
  }

  handleFilterChange(newFilters) {
    this.setState({ filters: newFilters });
  }

  handleSearchFilters() {
    const { fetchCatalogue, sources } = this.props;
    const { sourceIndex, searchQuery, filters } = this.state;

    fetchCatalogue(sources[sourceIndex].id, searchQuery, filters, { retainFilters: true });
  }

  render() {
    const {
      mangaLibrary,
      sources,
      hasNextPage,
      initialFilters,
      catalogueIsFetching,
      chaptersByMangaId,
      chaptersAreFetching,
      isTogglingFavorite,
      toggleFavoriteForManga,
    } = this.props;
    const {
      mangaIdBeingViewed, sourceIndex, filters, searchQuery,
    } = this.state;

    const mangaInfo = mangaLibrary.find(manga => manga.id === mangaIdBeingViewed);
    const chapters = chaptersByMangaId[mangaIdBeingViewed];

    if (!chaptersAreFetching && mangaInfo && chapters) {
      return (
        <MangaInfo
          mangaInfo={mangaInfo}
          chapters={chapters}
          initialTabValue={0}
          onBackClick={this.handleMangaInfoBackClick}
          isTogglingFavorite={isTogglingFavorite}
          toggleFavorite={toggleFavoriteForManga(mangaInfo.id, mangaInfo.favorite)}
        />
      );
    }

    return (
      <React.Fragment>
        <AppBar color="default" position="static" style={{ marginBottom: 20 }}>
          <Toolbar>
            <MenuDrawer />

            <form onSubmit={e => e.preventDefault()}>
              <FormControl>
                <Select value={sourceIndex} onChange={this.handleSourceChange}>
                  {sources.map((source, index) => (
                    <MenuItem value={index} key={source.id}>
                      {source.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Search"
                value={searchQuery}
                onChange={this.handleSearchChange}
              />
            </form>
          </Toolbar>
        </AppBar>

        <ResponsiveGrid>
          <DynamicSourceFilters
            filters={filters}
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

        {catalogueIsFetching && <CircularProgress />}
      </React.Fragment>
    );
  }
}

Catalogue.propTypes = {
  mangaLibrary: PropTypes.arrayOf(mangaType),
  sources: PropTypes.array, // TODO: type
  page: PropTypes.number.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  initialFilters: PropTypes.array, // TODO: type
  catalogueIsFetching: PropTypes.bool.isRequired,
  // TODO: chaptersByMangaId has dynamic keys, so I'm not writing a custom validator right now
  chaptersByMangaId: PropTypes.object.isRequired,
  chaptersAreFetching: PropTypes.bool.isRequired,
  isTogglingFavorite: PropTypes.bool.isRequired,
  // Below are redux dispatch functions
  fetchSources: PropTypes.func.isRequired,
  fetchCatalogue: PropTypes.func.isRequired,
  fetchFilters: PropTypes.func.isRequired,
  fetchNextCataloguePage: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
  toggleFavoriteForManga: PropTypes.func.isRequired,
};

Catalogue.defaultProps = {
  mangaLibrary: null,
  sources: null,
  initialFilters: null,
};

export default Catalogue;
