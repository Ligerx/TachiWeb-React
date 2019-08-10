// @flow
import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import compact from "lodash/compact";
import type { Manga } from "@tachiweb/api-client";
import type { ChapterType } from "types";
import { Server, Client } from "api";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Link from "components/Link";
import ImageWithLoader from "components/Reader/ImageWithLoader";
import ReaderOverlay from "components/Reader/ReaderOverlay";
import FullScreenLoading from "components/Loading/FullScreenLoading";
import SinglePageReader from "components/Reader/SinglePageReader";
import WebtoonReader from "components/Reader/WebtoonReader";
import ReadingStatusUpdater from "components/Reader/ReadingStatusUpdater";
import ImagePreloader from "components/Reader/ImagePreloader";
import ResponsiveGrid from "components/ResponsiveGrid";
import { chapterNumPrettyPrint } from "components/utils";
import UrlPrefixContext from "components/UrlPrefixContext";
import {
  selectChaptersForManga,
  selectChapter,
  selectNextChapterId,
  selectPrevChapterId
} from "redux-ducks/chapters";
import { fetchChapters } from "redux-ducks/chapters/actionCreators";
import { selectPageCounts, selectPageCount } from "redux-ducks/pageCounts";
import { fetchPageCount } from "redux-ducks/pageCounts/actionCreators";
import { selectDefaultViewer } from "redux-ducks/settings";
import { selectMangaInfo } from "redux-ducks/mangaInfos";
import { fetchMangaInfo } from "redux-ducks/mangaInfos/actionCreators";

// TODO: get rid of routing param for page

type RouterProps = {
  match: {
    params: {
      mangaId: string,
      chapterId: string
    }
  }
};

const useStyles = makeStyles({
  page: {
    width: "100%",
    marginBottom: 80
  },
  navButtonsParent: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 40
  },
  topOffset: {
    marginTop: 144
  }
});

// handleArrowKeyDown = (event: SyntheticKeyboardEvent<>) => {
//   const LEFT_ARROW = 37;
//   const RIGHT_ARROW = 39;

//   const { nextPageUrl, prevPageUrl } = this.props;

//   // TODO: is this the expected direction the arrows should take you?
//   if (event.keyCode === LEFT_ARROW && prevPageUrl) {
//     this.props.history.push(prevPageUrl);
//   } else if (event.keyCode === RIGHT_ARROW && nextPageUrl) {
//     this.props.history.push(nextPageUrl);
//   }
// };

function getChapterUrl(
  urlPrefix: string,
  mangaInfo: ?Manga,
  chapterId: number,
  chapters: ?Array<ChapterType>
): ?string {
  if (!chapters) return null;

  const chapter: ?ChapterType = chapters.find(chap => chap.id === chapterId);

  if (!mangaInfo || !chapter) return null;

  // Links to the chapter's last page read
  const goToPage = chapter.read ? 0 : chapter.last_page_read;

  return Client.page(urlPrefix, mangaInfo.id, chapterId, goToPage);
}

// TODO: include the pageCounts type
function getPrevPageUrl(
  urlPrefix: string,
  mangaInfo: ?Manga,
  chapterId: number,
  prevChapterId: number,
  page: number,
  pageCounts
): ?string {
  if (!mangaInfo) return null;

  if (page > 0) {
    return Client.page(urlPrefix, mangaInfo.id, chapterId, page - 1);
  }
  if (page === 0 && prevChapterId) {
    // If on the first page, link to the previous chapter's last page (if info available)
    const prevPageCount: ?number = pageCounts[prevChapterId];
    const lastPage = prevPageCount ? prevPageCount - 1 : 0;

    return Client.page(urlPrefix, mangaInfo.id, prevChapterId, lastPage);
  }
  return null;
}

function getNextPageUrl(
  urlPrefix: string,
  mangaInfo: ?Manga,
  chapterId: number,
  nextChapterId: number,
  page: number,
  pageCount: number
): ?string {
  if (!mangaInfo) return null;

  if (page < pageCount - 1) {
    return Client.page(urlPrefix, mangaInfo.id, chapterId, page + 1);
  }
  if (page === pageCount - 1 && nextChapterId) {
    return Client.page(urlPrefix, mangaInfo.id, nextChapterId, 0);
  }
  return null;
}

const SinglePageReader2 = ({ match: { params } }: RouterProps) => {
  const mangaId = parseInt(params.mangaId, 10);
  const chapterId = parseInt(params.chapterId, 10);

  // TODO: when do you account jumping page / initial page jump?
  const [page, setPage] = useState(0);

  const urlPrefix = useContext(UrlPrefixContext);

  const mangaInfo = useSelector(state => selectMangaInfo(state, mangaId));

  const chapters = useSelector(state => selectChaptersForManga(state, mangaId));
  const chapter = useSelector(state =>
    selectChapter(state, mangaId, chapterId)
  );

  const pageCounts = useSelector(selectPageCounts);
  const pageCount =
    useSelector(state => selectPageCount(state, chapterId)) || 0;

  const prevChapterId = useSelector(state =>
    selectPrevChapterId(state, mangaId, chapterId)
  );
  const nextChapterId = useSelector(state =>
    selectNextChapterId(state, mangaId, chapterId)
  );

  const prevChapterUrl = getChapterUrl(
    urlPrefix,
    mangaInfo,
    prevChapterId,
    chapters
  );
  const nextChapterUrl = getChapterUrl(
    urlPrefix,
    mangaInfo,
    nextChapterId,
    chapters
  );

  const prevPageUrl = getPrevPageUrl(
    urlPrefix,
    mangaInfo,
    chapterId,
    prevChapterId,
    page,
    pageCounts
  );
  const nextPageUrl = getNextPageUrl(
    urlPrefix,
    mangaInfo,
    chapterId,
    nextChapterId,
    page,
    pageCount
  );

  const classes = useStyles();

  useEffect(() => {
    document.addEventListener("keydown", this.handleArrowKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", this.handleArrowKeyDown);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mangaId, chapterId, page]);

  const handleJumpToPage = () => {};

  return (
    <>
      <Helmet
        title={`${mangaInfo.title} - Ch. ${chapterNumPrettyPrint(
          chapter.chapter_number
        )}, Pg. ${page + 1} TachiWeb`}
      />

      <ReaderOverlay
        title={mangaInfo.title}
        chapterNum={chapter.chapter_number}
        pageCount={pageCount}
        page={page}
        backUrl={Client.manga(urlPrefix, mangaInfo.id)}
        prevChapterUrl={prevChapterUrl}
        nextChapterUrl={nextChapterUrl}
        onJumpToPage={handleJumpToPage}
      />

      <ResponsiveGrid className={classes.topOffset}>
        <Grid item xs={12}>
          <Link to={nextPageUrl}>
            <ImageWithLoader
              src={Server.image(mangaInfo.id, chapterId, page)}
              className={classes.page}
              alt={`${chapter.name} - Page ${page + 1}`}
            />
          </Link>
        </Grid>

        <Grid item xs={12} className={classes.navButtonsParent}>
          <Button component={Link} to={prevPageUrl} disabled={!prevPageUrl}>
            <Icon>navigate_before</Icon>
            Previous Page
          </Button>
          <Button component={Link} to={nextPageUrl} disabled={!nextPageUrl}>
            Next Page
            <Icon>navigate_next</Icon>
          </Button>
        </Grid>
      </ResponsiveGrid>
    </>
  );
};

export default withRouter(SinglePageReader2);
