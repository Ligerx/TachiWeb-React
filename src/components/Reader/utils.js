// @flow
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Server } from "api";
import { updateReadingStatus } from "redux-ducks/chapters/actionCreators";

// eslint-disable-next-line import/prefer-default-export
export function usePagePreloader(
  mangaId: number,
  chapterId: number,
  page: number,
  pageCount: number,
  nextChapterId: ?number
) {
  // This expects whatever component is using it to load pageCount for the current chapter

  // TODO: Do we want to preload one behind as well?
  //       Loading from only this chapter would be trivial.
  //
  //       However, if you want to load from the previous chapter, it would
  //       require the previous chapter object and prev chapter pageCount.

  // https://www.photo-mark.com/notes/image-preloading/
  // https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

  useEffect(() => {
    const numPreloadAhead = 3;

    for (let i = 1; i <= numPreloadAhead; i += 1) {
      // Chrome only seems to preload if a new image object is used every time
      const image = new Image();

      if (page + i < pageCount) {
        // Load pages from this chapter
        image.src = Server.image(mangaId, chapterId, page + i);
      } else if (nextChapterId) {
        // Load pages from next chapter
        // NOTE: Not bothering to check next chapter's pageCount. Doubt this will be a problem.
        /* eslint-disable no-mixed-operators */
        image.src = Server.image(mangaId, nextChapterId, page + i - pageCount);
      }
    }
  }, [chapterId, mangaId, nextChapterId, page, pageCount]);
}

export function useUpdateReadingStatus(
  mangaId: number,
  chapterId: number,
  page: number
) {
  // TODO: special case to consider?
  //       If you are on the last page of a chapter then go to the next chapter's first page,
  //       AND we didn't already mark you as having completed this chapter,
  //       your reading status currently won't be updated
  //
  //       Could this also cause problems if a chapter only has 1 page total?

  // TODO: should I bother ignoring page jumps? (within the same chapter)
  //       One method of doing so is if the difference in page change isn't 1, ignore it

  const dispatch = useDispatch();

  useEffect(() => {
    // updateReadingStatus() is handling whether or not an update should be made
    dispatch(updateReadingStatus(mangaId, chapterId, page));
  }, [dispatch, mangaId, chapterId, page]);
}
