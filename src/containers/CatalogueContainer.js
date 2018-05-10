import { connect } from 'react-redux';
import { fetchSources } from 'redux-ducks/sources';
import { fetchCatalogue } from 'redux-ducks/catalogue';
import Catalogue from 'pages/Catalogue';

const mapStateToProps = (state) => {
  const {
    mangaIds, page, hasNextPage, query, filters,
  } = state.catalogue;
  return {
    mangaLibrary: state.library.mangaLibrary.filter(manga => mangaIds.includes(manga.id)),
    // Sources props
    sources: state.sources.sourcesArray,
    // Catalogue props
    mangaIds,
    page,
    hasNextPage,
    query,
    filters,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSources: () => dispatch(fetchSources()),
  // Passing in the new catalogue search settings
  fetchCatalogue: (sourceId, page, query, filters) =>
    dispatch(fetchCatalogue(sourceId, page, query, filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
