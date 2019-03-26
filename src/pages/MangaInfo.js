// @flow
import * as React from "react";
import type { MangaInfoContainerProps } from "containers/MangaInfoContainer";
import { Helmet } from "react-helmet";
import MangaInfoHeader from "components/mangaInfo/MangaInfoHeader";
import MangaInfoDetails from "components/mangaInfo/MangaInfoDetails";
import FullScreenLoading from "components/loading/FullScreenLoading";
import MangaInfoChapters from "components/mangaInfo/MangaInfoChapters";

type State = { tabValue: number };

class MangaInfo extends React.Component<MangaInfoContainerProps, State> {
  state = {
    tabValue: this.props.defaultTab
  };

  componentDidMount() {
    const {
      fetchMangaInfo,
      fetchChapters,
      fetchSources,
      updateMangaInfo,
      updateChapters
    } = this.props;

    fetchChapters().then(() => {
      // Fetch chapters cached on the server
      // If there are none, tell the server to scrape chapters from the site
      if (!this.props.chapters.length) {
        return updateChapters();
      }
      return null;
    });

    fetchMangaInfo().then(() => {
      const { mangaInfo } = this.props;
      // Update manga manually if the server has not fetched the data for
      //   this manga yet
      if (mangaInfo && !mangaInfo.initialized) {
        updateMangaInfo();
      }
    });

    fetchSources();
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
    const { source, mangaInfo, chapters, toggleRead } = this.props;

    const numChapters: number = chapters ? chapters.length : 0;

    if (mangaInfo && tabValue === 0) {
      return (
        <MangaInfoDetails
          source={source}
          mangaInfo={mangaInfo}
          numChapters={numChapters}
        />
      );
    }
    if (mangaInfo && tabValue === 1) {
      return (
        <MangaInfoChapters
          chapters={chapters}
          mangaInfo={mangaInfo}
          toggleRead={toggleRead}
        />
      );
    }
    return null;
  };

  render() {
    const { tabValue } = this.state;
    const { mangaInfo, fetchOrRefreshIsLoading, backUrl, setFlag } = this.props;

    const title = mangaInfo ? mangaInfo.title : "Loading...";

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

export default MangaInfo;
