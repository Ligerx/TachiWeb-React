import React from 'react';
import ResponsiveGrid from 'components/ResponsiveGrid';
import LibraryMangaCard from 'components/LibraryMangaCard';
import PropTypes from 'prop-types';

// TODO: filtering. does that happen here or the parent?

const MangaGrid = ({ mangaLibrary }) => (
  <ResponsiveGrid container justify="center">
    {mangaLibrary.map(manga => <LibraryMangaCard key={manga.id} manga={manga} />)}
  </ResponsiveGrid>
);

// TODO: make proptypes more explicit?
MangaGrid.propTypes = {
  mangaLibrary: PropTypes.array.isRequired,
};

export default MangaGrid;
