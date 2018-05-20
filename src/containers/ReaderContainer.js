import { connect } from 'react-redux';
import { fetchLibrary } from 'redux-ducks/library';
import { fetchChapters, updateReadingStatus } from 'redux-ducks/chapters';
import { fetchPageCount } from 'redux-ducks/pageCounts';
import Reader from 'pages/Reader';

const mapStateToProps = (state, ownProps) => {
  const { library, chapters } = state;
  const { pageCountsByChapterId } = state.pageCounts;
  const { mangaId, chapterId } = ownProps.match.params;

  return {
    mangaInfo: getThisManga(library.mangaLibrary, mangaId),
    chapters: chapters[mangaId],
    chapter: findChapter(chapters[mangaId], chapterId),
    pageCount: pageCountsByChapterId[chapterId],
    page: parseInt(ownProps.match.params.page, 10),
    prevChapterId: getPrevChapterId(chapters[mangaId], chapterId),
    nextChapterId: getNextChapterId(chapters[mangaId], chapterId),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { mangaId, chapterId } = ownProps.match.params;

  return {
    fetchLibrary: () => dispatch(fetchLibrary()),
    fetchChapters: () => dispatch(fetchChapters(mangaId)),
    fetchPageCount: () => dispatch(fetchPageCount(mangaId, chapterId)),
    updateReadingStatus: (chapter, pageCount, readPage) =>
      dispatch(updateReadingStatus(mangaId, chapter, pageCount, readPage)),
  };
};

// Helper functions
function getThisManga(mangaLibrary, mangaId) {
  return mangaLibrary.find(manga => manga.id === parseInt(mangaId, 10));
}

function findChapter(chapters, chapterId) {
  return chapters.find(chapter => chapter.id === parseInt(chapterId, 10));
}

function findChapterIndex(chapters, thisChapterId) {
  // If not found, returns -1. BUT this shouldn't ever happen.
  return chapters.findIndex(chapter => chapter.id === parseInt(thisChapterId, 10));
}

function getPrevChapterId(chapters, thisChapterId) {
  if (!chapters) return null;

  const thisChapterIndex = findChapterIndex(chapters, thisChapterId);
  if (thisChapterIndex === 0) {
    return null;
  }
  return chapters[thisChapterIndex - 1].id;
}

function getNextChapterId(chapters, thisChapterId) {
  if (!chapters) return null;

  const thisChapterIndex = findChapterIndex(chapters, thisChapterId);
  if (thisChapterIndex === chapters.length - 1) {
    return null;
  }
  return chapters[thisChapterIndex + 1].id;
}

export default connect(mapStateToProps, mapDispatchToProps)(Reader);
