// @flow
import * as React from 'react';
import type { MangaInfoContainerProps } from 'containers/MangaInfoContainer';
import type { MangaType } from 'types';
import { Helmet } from 'react-helmet';
import MangaInfoHeader from 'components/mangaInfo/MangaInfoHeader';
import MangaInfoDetails from 'components/mangaInfo/MangaInfoDetails';
import SortFilterChapters from 'components/mangaInfo/SortFilterChapters';
import MangaInfoChapters from 'components/mangaInfo/MangaInfoChapters';
import FullScreenLoading from 'components/loading/FullScreenLoading';
import FavoriteFABContainer from 'containers/FavoriteFABContainer';
import ContinueReadingButton from 'components/mangaInfo/ContinueReadingButton';
import CenterHorizontally from 'components/CenterHorizontally';

type State = { tabValue: number };

class MangaInfo extends React.Component<MangaInfoContainerProps, State> {
  state = {
    tabValue: this.props.defaultTab,
  };

  componentDidMount() {
    const {
      fetchMangaInfo, fetchChapters, updateMangaInfo, updateChapters,
    } = this.props;

    fetchChapters()
      .then(() => {
        // Fetch chapters cached on the server
        // If there are none, tell the server to scrape chapters from the site
        if (!this.props.chapters.length) {
          return updateChapters(); // return promise so next .then()'s wait
        }
        return null;
      })
      .then(() => fetchMangaInfo())
      .then(() => {
        // If we think the server hasn't had enough time to scrape the source website
        // for this mangaInfo, wait a little while and try fetching again.
        //
        // NOTE: This only updates the manga being viewed. Many of your other search results are
        //       likely missing information as well. Viewing them will then fetch the data.
        //
        // TODO: might try to do one additional fetch at a slightly later time. e.g. 1000 ms
        const { mangaInfo } = this.props;
        if (mangaInfo && possiblyMissingInfo(mangaInfo)) {
          setTimeout(() => updateMangaInfo(), 300);
        }
      });
  }

  handleChangeTab = (event: SyntheticEvent<>, newValue: number) => {
    this.setState({ tabValue: newValue });
  };

  handleRefreshClick = () => {
    const { updateChapters, updateMangaInfo } = this.props;

    // Running updateChapters also updates mangaInfo.chapters and mangaInfo.unread
    // So run updateMangaInfo after chapters
    updateChapters().then(() => updateMangaInfo());
  };

  tabContent = (): React.Node => {
    const { tabValue } = this.state;
    const { mangaInfo, chapters, toggleRead } = this.props;

    const numChapters: number = chapters ? chapters.length : 0;

    if (mangaInfo) {
      if (tabValue === 0) {
        return (
          <MangaInfoDetails mangaInfo={mangaInfo} numChapters={numChapters}>
            <FavoriteFABContainer mangaId={mangaInfo.id} />
          </MangaInfoDetails>
        );
      } else if (tabValue === 1) {
        return (
          <React.Fragment>
            <CenterHorizontally>
              <ContinueReadingButton
                chapters={chapters}
                mangaId={mangaInfo.id}
                style={{ marginBottom: 24 }}
              />
            </CenterHorizontally>

            <SortFilterChapters mangaInfoFlags={mangaInfo.flags} chapters={chapters}>
              {sortedFilteredChapters => (
                <MangaInfoChapters
                  mangaInfo={mangaInfo}
                  chapters={sortedFilteredChapters}
                  toggleRead={toggleRead}
                />
              )}
            </SortFilterChapters>
          </React.Fragment>
        );
      }
    }
    return null;
  };

  render() {
    const { tabValue } = this.state;
    const {
      mangaInfo,
      fetchOrRefreshIsLoading,
      backUrl,
      setFlag,
    } = this.props;

    const title = mangaInfo ? mangaInfo.title : 'Loading...';

    return (
      <React.Fragment>
        <Helmet>
          <title>{title} - TachiWeb</title>
        </Helmet>

        <MangaInfoHeader
          mangaInfo={mangaInfo}
          tabValue={tabValue}
          handleChangeTab={this.handleChangeTab}
          onBackClick={backUrl}
          onRefreshClick={this.handleRefreshClick}
          setFlag={setFlag}
        />
        {this.tabContent()}

        {fetchOrRefreshIsLoading && <FullScreenLoading />}
      </React.Fragment>
    );
  }
}

// Helper methods
function possiblyMissingInfo(manga: MangaType): boolean {
  // mangaFields is an array of some values that mangaInfo should probably have
  // Count the number of these fields that are missing
  const mangaFields = ['author', 'description', 'genres', 'categories'];

  const numMissing = mangaFields.reduce((counter, field) => {
    const value = manga[field];

    if (!value || (Array.isArray(value) && !value.length)) {
      return counter + 1;
    }
    return counter;
  }, 0);

  // setting the arbitrary amount of missing info at 3 to be considered missing info
  return numMissing >= 3;
}

export default MangaInfo;
