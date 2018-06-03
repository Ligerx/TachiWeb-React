// @flow
import * as React from 'react';

// NOTE: sortFuncs.UNREAD and readFilterFuncs require the # of unread chapters for a manga
//       Because I'm keeping unread data separate from the mangaInfo, I need to pass unread
//       to them (even though sortFuncs only needs it for one type).

const sortFuncs = unread => ({
  ALPHABETICALLY: (a, b) => {
    const aTitle = a.title.toUpperCase();
    const bTitle = b.title.toUpperCase();

    return aTitle < bTitle ? -1 : 1; // Do I need to account for when they're equal (return 0)?
  },
  UNREAD: (a, b) => unread[a.id] - unread[b.id],
  TOTAL_CHAPTERS: (a, b) => a.chapters - b.chapters,
  SOURCE: () => -1, // is this a valid way to NOT sort an array?

  // TODO: I don't think I have or can easily get the data needed for these sorts
  // LAST_READ: ,
  // LAST_UPDATED: ,
});

const readFilterFuncs = unread => ({
  ALL: () => true,
  UNREAD: mangaInfo => unread[mangaInfo.id], // 0 (or null/undefined) will be false
});

const downloadedFilterFuncs = {
  ALL: () => true,
  DOWNLOADED: mangaInfo => mangaInfo.downloaded,
};

const completedFilterFuncs = {
  ALL: () => true,

  // could COMPLETED be a different variation?
  // e.g. lowercase or uppercase
  COMPLETED: mangaInfo => mangaInfo.status === 'Completed',
};

const searchFilterFunc = searchQuery => mangaInfo =>
  mangaInfo.title.toUpperCase().includes(searchQuery.toUpperCase());

/* eslint-disable react/prefer-stateless-function */
// Having a named class allows it to show up in react dev tools
const SortFilterLibraryHOC = (WrappedComponent: React.Node) =>
  class withSortedFilteredChapters extends React.Component {
    render() {
      const {
        mangaInfos, flags, searchQuery, unread, ...otherProps
      } = this.props;

      const {
        SORT_TYPE, READ_FILTER, DOWNLOADED_FILTER, COMPLETED_FILTER, SORT_DIRECTION,
      } = flags;

      let sortedFilteredLibrary = mangaInfos
        .slice() // clone array
        .sort(sortFuncs(unread)[SORT_TYPE])
        .filter(readFilterFuncs(unread)[READ_FILTER])
        .filter(downloadedFilterFuncs[DOWNLOADED_FILTER])
        .filter(completedFilterFuncs[COMPLETED_FILTER])
        .filter(searchFilterFunc(searchQuery));

      if (SORT_DIRECTION === 'DESCENDING') {
        sortedFilteredLibrary = sortedFilteredLibrary.reverse();
      }

      return <WrappedComponent {...otherProps} mangaLibrary={sortedFilteredLibrary} />;
    }
  };

export default SortFilterLibraryHOC;
