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

// TODO: sources type
// TODO: filter type?
// TODO: keep previous scroll position when going back from MangaInfo -> Catalogue
// TODO: if you're looking at a new manga, chapters won't have been scraped by the server yet.
//       Need to force an update when it's empty?
//       This is probably also an issue w/ library.
// TODO: all of filtering.
// TODO: actually split all of this up into components...

class Catalogue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Select based on index of the array instead of id
      // this makes it less reliant on having to sync state with the data
      sourceId: 0,
      searchQuery: '',
      mangaIdBeingViewed: null,
    };

    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleMangaInfoBackClick = this.handleMangaInfoBackClick.bind(this);
    this.handleLoadNextPage = this.handleLoadNextPage.bind(this);
    this.handleUpdateFilters = this.handleUpdateFilters.bind(this);
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
      const { sourceId, searchQuery } = this.state;
      const { filters } = this.props;
      fetchCatalogue(this.props.sources[sourceId].id, searchQuery, filters);
    }, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    const { sourceId } = this.state;
    const { sources, fetchCatalogue, fetchFilters } = this.props;

    if (sourceId !== prevState.sourceId) {
      fetchCatalogue(sources[sourceId].id);
      fetchFilters(sources[sourceId].id);
    }
  }

  componentWillUnmount() {
    // Clean up debouncing function
    this.delayedSearch.cancel();
  }

  handleSourceChange(event) {
    // TODO: not sure if setting 'filter: null' is correct right now
    this.setState({ sourceId: event.target.value, searchQuery: '' });
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
    if (this.props.hasNextPage) {
      this.props.fetchNextCataloguePage(this.props.sources[this.state.sourceId].id);
    }
  }

  handleUpdateFilters(newFilters) {
    return () => {
      const { fetchCatalogue } = this.props;
      const { sourceId, searchQuery } = this.state;
      fetchCatalogue(this.props.sources[sourceId].id, searchQuery, newFilters);
    };
  }

  render() {
    const {
      mangaLibrary,
      sources,
      hasNextPage,
      filters,
      catalogueIsFetching,
      chaptersByMangaId,
      chaptersAreFetching,
      isTogglingFavorite,
      toggleFavoriteForManga,
    } = this.props;
    const { mangaIdBeingViewed, sourceId } = this.state;

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
                <Select value={this.state.sourceId} onChange={this.handleSourceChange}>
                  {sources.map((source, index) => (
                    <MenuItem value={index} key={source.id}>
                      {source.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Search"
                value={this.state.searchQuery}
                onChange={this.handleSearchChange}
              />
            </form>
          </Toolbar>
        </AppBar>

        <ResponsiveGrid>
          <DynamicSourceFilters filters={filters} sourceId={sourceId} onSearchClick={this.handleUpdateFilters} />
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
  query: PropTypes.string.isRequired,
  filters: PropTypes.array, // TODO: type
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
  filters: null,
};

export default Catalogue;
