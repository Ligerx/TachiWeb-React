// @flow
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Server } from "api";
import { updateReadingStatus } from "redux-ducks/chapters/actionCreators";

export function usePagePreloader(
  mangaId: number,
  chapterId: number,
  page: ?number, // possibly null on WebtoonReader init
  pageCount: number,
  nextChapterId: ?number,
  skipEffect?: boolean = false
) {
  // https://www.photo-mark.com/notes/image-preloading/
  // https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

  // TODO: Do we want to preload one previous page as well?
  // It would be easy to load pages from the current chapter.
  // However, load one page from the previous chapter would require
  // prevChapterId and prev chapter pageCount.

  useEffect(() => {
    if (skipEffect) return;
    if (page == null) return;

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
        image.src = Server.image(mangaId, nextChapterId, page + i - pageCount);
      }
    }
  }, [chapterId, mangaId, nextChapterId, page, pageCount, skipEffect]);
}

export function useUpdateReadingStatus(
  mangaId: number,
  chapterId: number,
  page: ?number, // possibly null on WebtoonReader init
  skipEffect?: boolean = false
) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (skipEffect) return;
    if (page == null) return;

    // updateReadingStatus() is handling whether or not an update should be made
    dispatch(updateReadingStatus(mangaId, chapterId, page));
  }, [dispatch, mangaId, chapterId, page, skipEffect]);
}

export function useReaderScrollToTop(
  mangaId: number,
  chapterId: number,
  page?: number // used by SinglePageReader but not WebtoonReader
) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mangaId, chapterId, page]);
}
