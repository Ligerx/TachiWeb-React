// @flow
import React, { Component } from 'react';
import LibraryHeader from 'components/LibraryHeader';
import MangaGrid from 'components/MangaGrid';
import LibraryMangaCard from 'components/LibraryMangaCard';
import type { MangaType } from 'types';
import FullScreenLoading from 'components/loading/FullScreenLoading';

type Props = {
  mangaLibrary?: Array<MangaType>,
  unread: Array<number>, // TODO: unread type?
  libraryIsLoading: boolean,
  fetchLibrary: Function,
  fetchUnread: Function,
};

// TODO: sort/filter mangaLibrary

// NOTE: unread count relies on the server knowing how many chapters there are
//       If for some reason the server hasn't scraped a list of chapters, this number won't appear

class Library extends Component<Props> {
  static defaultProps = {
    mangaLibrary: [],
  };

  componentDidMount() {
    this.props.fetchLibrary();
    this.props.fetchUnread();
  }

  handleRefreshClick = () => {
    this.props.fetchLibrary({ ignoreCache: true });
  };

  render() {
    const { mangaLibrary, unread, libraryIsLoading } = this.props;

    return (
      <React.Fragment>
        <LibraryHeader onRefreshClick={this.handleRefreshClick} />

        <MangaGrid
          mangaLibrary={mangaLibrary}
          cardComponent={<LibraryMangaCard unread={unread} />}
        />

        {libraryIsLoading && <FullScreenLoading />}
      </React.Fragment>
    );
  }
}

export default Library;
