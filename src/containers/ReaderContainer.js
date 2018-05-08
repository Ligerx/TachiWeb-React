import { connect } from 'react-redux';
import { fetchLibrary } from 'redux-ducks/library';
import { fetchChapters } from 'redux-ducks/chapters';
import { fetchPageCount } from 'redux-ducks/pageCounts';
import Reader from 'pages/Reader';

// Currently this is mostly a copy paste from MangaInfoContainer

const getThisManga = (mangaLibrary, mangaId) =>
  mangaLibrary.find(manga => manga.id === parseInt(mangaId, 10));

const findChapter = (chapters, chapterId) =>
  chapters.find(chapter => chapter.id === parseInt(chapterId, 10));

const mapStateToProps = (state, ownProps) => {
  const { library } = state;
  const { chapters } = state.chapters;
  const { pageCountsByMangaId } = state.pageCounts;
  const { mangaId, chapterId } = ownProps.match.params;

  return {
    mangaInfo: getThisManga(library.mangaLibrary, mangaId),
    chapters: chapters[mangaId],
    chapter: chapters[mangaId] ? findChapter(chapters[mangaId], chapterId) : null,
    mangaInfoIsFetching: library.isFetching,
    pageCount: pageCountsByMangaId[mangaId] ? pageCountsByMangaId[mangaId][chapterId] : null,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { mangaId, chapterId } = ownProps.match.params;

  return {
    fetchLibrary: () => dispatch(fetchLibrary()),
    fetchChapters: () => dispatch(fetchChapters(mangaId)),
    fetchPageCount: () => dispatch(fetchPageCount(mangaId, chapterId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reader);
