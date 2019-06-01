// @flow
import { connect } from "react-redux";
import FavoriteFAB from "components/FavoriteFAB";
import {
  selectIsFavoriteToggling,
  selectIsFavorite,
  toggleFavorite
} from "redux-ducks/mangaInfos";

type Params = {
  mangaId: number
};

type StateToProps = {
  isFavorite: boolean,
  favoriteIsToggling: boolean
};

const mapStateToProps = (state, { mangaId }: Params): StateToProps => {
  return {
    isFavorite: selectIsFavorite(state, mangaId),
    favoriteIsToggling: selectIsFavoriteToggling(state)
  };
};

type DispatchToProps = {
  toggleFavorite: Function
};

const mapDispatchToProps = (
  dispatch,
  { mangaId }: Params
): DispatchToProps => ({
  toggleFavorite: isFavorite => () => {
    return dispatch(toggleFavorite(mangaId, isFavorite));
  }
});

export type FavoriteFABContainerProps = StateToProps & DispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteFAB);
