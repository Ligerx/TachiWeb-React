import React from 'react';
import Icon from 'material-ui/Icon';
import FAB from 'components/FAB';

// NOTE: refer to FAB for specific CSS instructions

// TODO: would be nice to have a loading spinner while the server processes a favorite/unfavorite action

const FavoriteFAB = ({ favorite, onClick }) => (
  <FAB onClick={onClick}>{favorite ? <Icon>bookmark</Icon> : <Icon>bookmark_border</Icon>}</FAB>
);

export default FavoriteFAB;
