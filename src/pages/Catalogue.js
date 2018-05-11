import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mangaType } from 'types';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import MangaGrid from 'components/MangaGrid';
import CatalogueMangaCard from 'components/CatalogueMangaCard';
import MangaInfo from 'components/MangaInfo';

// TODO: hook up MangaInfo component + update the card links
// TODO: render components such that going from MangaInfo -> Catalogue preserves state
// TODO: infinite scrolling, load more manga when scrolling down
// TODO: sources type
// TODO: filter type?
// TODO: FIXME: running into problem w/ favorite property of catalogue manga does not exist
// TODO: back button should be dynamic.
// TODO: if you're looking at a new manga, chapters won't have been scraped by the server yet.
//       This is probably also an issue w/ library.

class Catalogue extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Select based on index of the array instead of id
      // this makes it less reliant on having to sync state with the data
      value: 0,
      mangaBeingViewed: null,
    };

    this.handleSourceChange = this.handleSourceChange.bind(this);
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
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.state;
    const { sources, fetchCatalogue } = this.props;

    if (value !== prevState.value) {
      fetchCatalogue(sources[value].id);
    }
  }

  handleSourceChange(event) {
    this.setState({ value: event.target.value });
  }

  handleCardClick(manga) {
    return () => {
      this.props.fetchChapters(manga.id);
      this.setState({ mangaBeingViewed: manga });
    };
  }

  handleMangaInfoBackClick() {
    this.setState({ mangaBeingViewed: null });
  }

  render() {
    const {
      mangaLibrary, sources, chaptersByMangaId, chaptersAreFetching,
    } = this.props;
    const { mangaBeingViewed } = this.state;

    if (!chaptersAreFetching && mangaBeingViewed && chaptersByMangaId[mangaBeingViewed.id]) {
      return (
        <MangaInfo
          mangaInfo={mangaBeingViewed}
          chapters={chaptersByMangaId[mangaBeingViewed.id]}
          initialTabValue={0}
          onBackClick={this.handleMangaInfoBackClick}
        />
      );
    }

    return (
      <React.Fragment>
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
        </form>

        <MangaGrid
          mangaLibrary={mangaLibrary}
          cardComponent={<CatalogueMangaCard onClick={this.handleCardClick} />}
        />
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
  fetchSources: PropTypes.func.isRequired,
  fetchCatalogue: PropTypes.func.isRequired,
  fetchChapters: PropTypes.func.isRequired,
};

Catalogue.defaultProps = {
  mangaLibrary: null,
  sources: null,
  filters: null,
};

export default Catalogue;
