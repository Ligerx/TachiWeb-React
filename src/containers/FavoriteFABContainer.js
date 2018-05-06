import { connect } from 'react-redux';
import { toggleFavorite } from 'redux-ducks/library';
import FavoriteFAB from 'components/FavoriteFAB';
import { withRouter } from 'react-router-dom';

const getThisManga = (mangaLibrary, mangaId) =>
  mangaLibrary.find(manga => manga.id === parseInt(mangaId, 10)) || {};

const mapStateToProps = (state, ownProps) => ({
  isFavorite: getThisManga(state.library.mangaLibrary, ownProps.match.params.mangaId).favorite,
  isTogglingFavorite: state.library.isTogglingFavorite,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleFavorite: () => dispatch(toggleFavorite(ownProps.match.params.mangaId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FavoriteFAB));
