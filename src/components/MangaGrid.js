import React from 'react';
import ResponsiveGrid from 'components/ResponsiveGrid';
import PropTypes from 'prop-types';
import { mangaType } from 'types';

// NOTE: You must pass a cardComponent, which is what will be rendered.
//       As of writing this, there is LibraryMangaCard and CatalogueMangaCard
// e.g. <MangaGrid mangaLibrary={mangaLibrary} cardComponent={<LibraryMangaCard />} />

// https://reactjs.org/docs/composition-vs-inheritance.html
// https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children

const MangaGrid = ({ mangaLibrary, cardComponent }) => (
  <ResponsiveGrid container justify="center">
    {mangaLibrary.map(manga => React.cloneElement(cardComponent, { key: manga.id, manga }))}
  </ResponsiveGrid>
);

MangaGrid.propTypes = {
  mangaLibrary: PropTypes.arrayOf(mangaType).isRequired,
  cardComponent: PropTypes.element.isRequired,
};

export default MangaGrid;
