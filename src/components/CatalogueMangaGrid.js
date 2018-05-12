import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MangaGrid from 'components/MangaGrid';
import CatalogueMangaCard from 'components/CatalogueMangaCard';
import { mangaType } from 'types';

class CatalogueMangaGrid extends Component {
  render() {
    const { mangaLibrary, onCardClick } = this.props;

    return (
      <MangaGrid
        mangaLibrary={mangaLibrary}
        cardComponent={<CatalogueMangaCard onClick={onCardClick} />}
      />
    );
  }
}

CatalogueMangaGrid.propTypes = {
  mangaLibrary: PropTypes.arrayOf(mangaType).isRequired,
  onCardClick: PropTypes.func.isRequired,
};

export default CatalogueMangaGrid;
