// @flow
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { updateReadingStatus } from "redux-ducks/chapters";
import { usePrevious } from "components/hooks";

// TODO: special case to consider?
//       If you are on the last page of a chapter then go to the next chapter's first page,
//       AND we didn't already mark you as having completed this chapter,
//       your reading status currently won't be updated
//
//       Could this also cause problems if a chapter only has 1 page total?

// TODO: should I bother ignoring page jumps? (within the same chapter)
//       One method of doing so is if the difference in page change isn't 1, ignore it

const ReadingStatusUpdater = ({ match }) => {
  const mangaId = parseInt(match.params.mangaId, 10);
  const chapterId = parseInt(match.params.chapterId, 10);
  const page = parseInt(match.params.page, 10);

  const prevMangaId = usePrevious(mangaId);
  const prevChapterId = usePrevious(chapterId);
  const prevPage = usePrevious(page);

  const dispatch = useDispatch();

  useEffect(() => {
    // If you're viewing the same manga + chapter, but the page
    // has changed, check if we should update your reading status
    const sameChapter = mangaId === prevMangaId && chapterId === prevChapterId;
    const pageChanged = page !== prevPage;

    if (sameChapter && pageChanged) {
      // this is letting the updateReadingStatus() method check if an update should be made
      // not sure if is the ideal way of doing it?
      dispatch(updateReadingStatus(mangaId, chapterId, page));
    }
  }, [
    chapterId,
    dispatch,
    mangaId,
    page,
    prevChapterId,
    prevMangaId,
    prevPage
  ]);

  return null;
};

export default withRouter(ReadingStatusUpdater);
