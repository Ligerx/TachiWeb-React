// @flow
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { Server } from "api";
import { selectPageCount } from "redux-ducks/pageCounts";
import { selectNextChapterId } from "redux-ducks/chapters";

// This expects whatever component is using it to load pageCount for the current chapter

// TODO: Consider making this a custom useEffect hook?

// TODO: Do we want to preload one behind as well?
//       Loading from only this chapter would be trivial.
//
//       However, if you want to load from the previous chapter, it would
//       require the previous chapter object and prev chapter pageCount.

// https://www.photo-mark.com/notes/image-preloading/
// https://stackoverflow.com/questions/1787319/preload-hidden-css-images?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

const preloadImages = (page, pageCount, mangaId, chapterId, nextChapterId) => {
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
};

type Props = { match: { params: Object } };

const ImagePreloader = ({ match: { params } }: Props) => {
  const mangaId = parseInt(params.mangaId, 10);
  const chapterId = parseInt(params.chapterId, 10);
  const page = parseInt(params.page, 10);

  // FIXME: inefficient redux design?
  const pageCount =
    useSelector(state => selectPageCount(state, chapterId)) || 0;

  const nextChapterId = useSelector(state =>
    selectNextChapterId(state, mangaId, chapterId)
  );

  useEffect(() => {
    preloadImages(page, pageCount, mangaId, chapterId, nextChapterId);
  }, [mangaId, chapterId, nextChapterId, page, pageCount]);

  return null;
};

export default withRouter(ImagePreloader);
