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
import CatalogueMangaGrid from 'components/CatalogueMangaGrid';

// TODO: render components such that going from MangaInfo -> Catalogue preserves state
// TODO: infinite scrolling, load more manga when scrolling down
// TODO: sources type
// TODO: filter type?
// TODO: if you're looking at a new manga, chapters won't have been scraped by the server yet.
//       This is probably also an issue w/ library.

class Catalogue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Select based on index of the array instead of id
      // this makes it less reliant on having to sync state with the data
      value: 0,
      searchQuery: '',
      filter: null, // TODO: implement this
      mangaIdBeingViewed: null,
    };

    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleMangaInfoBackClick = this.handleMangaInfoBackClick.bind(this);
  }

  componentDidMount() {
    const { fetchSources, fetchCatalogue } = this.props;

    // I think there's a bug in babel. I should be able to reference 'this' (in the outer scope)
    // when using an arrow function, but it's undefined. So I'm manually binding 'this'.
    const that = this;
    fetchSources().then(() => {
      fetchCatalogue(that.props.sources[0].id);
    });

    // https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
    // Debouncing the search text
    this.delayedSearch = debounce(() => {
      const { value, searchQuery, filter } = this.state;
      fetchCatalogue(this.props.sources[value].id, searchQuery, filter);
    }, 500);
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.state;
    const { sources, fetchCatalogue } = this.props;

    if (value !== prevState.value) {
      fetchCatalogue(sources[value].id);
    }
  }

  componentWillUnmount() {
    // Clean up debouncing function
    this.delayedSearch.cancel();
  }

  handleSourceChange(event) {
    // TODO: not sure if setting 'filter: null' is correct right now
    this.setState({ value: event.target.value, searchQuery: '', filter: null });
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

  render() {
    const {
      mangaLibrary,
      sources,
      chaptersByMangaId,
      chaptersAreFetching,
      isTogglingFavorite,
      toggleFavoriteForManga,
    } = this.props;
    const { mangaIdBeingViewed } = this.state;

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

            <form autoComplete="off">
              <FormControl>
                <Select value={this.state.value} onChange={this.handleSourceChange}>
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

        <CatalogueMangaGrid mangaLibrary={mangaLibrary} onCardClick={this.handleCardClick} />
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
  // TODO: chaptersByMangaId has dynamic keys, so I'm not writing a custom validator right now
  chaptersByMangaId: PropTypes.object.isRequired,
  chaptersAreFetching: PropTypes.bool.isRequired,
  isTogglingFavorite: PropTypes.bool.isRequired,
  fetchSources: PropTypes.func.isRequired,
  fetchCatalogue: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
  toggleFavoriteForManga: PropTypes.func.isRequired,
};

Catalogue.defaultProps = {
  mangaLibrary: null,
  sources: null,
  filters: null,
};

export default Catalogue;
