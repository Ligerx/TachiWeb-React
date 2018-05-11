import { connect } from 'react-redux';
import { fetchSources } from 'redux-ducks/sources';
import { fetchCatalogue } from 'redux-ducks/catalogue';
import Catalogue from 'pages/Catalogue';

const mapStateToProps = (state) => {
  const {
    mangaLibrary, page, hasNextPage, query, filters,
  } = state.catalogue;
  return {
    // Sources props
    sources: state.sources.sourcesArray,
    // Catalogue props
    mangaLibrary,
    page,
    hasNextPage,
    query,
    filters,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSources: () => dispatch(fetchSources()),
  // Passing in the new catalogue search settings
  fetchCatalogue: (sourceId, query, filters) => dispatch(fetchCatalogue(sourceId, query, filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
