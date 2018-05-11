import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'chapters/LOAD_REQUEST';
const SUCCESS = 'chapters/LOAD_SUCCESS';
const FAILURE = 'chapters/LOAD_FAILURE';
const CACHE = 'chapters/LOAD_CACHE';

// ================================================================================
// Reducers
// ================================================================================

// TODO: right now state is chapters.chapters{ mangaId: [chapter] }, which is confusing.
//       I'd love to rename chapters.chapters to something that makes more sense.
//
//       Update: call it chapters.chaptersByMangaId
//       chaptersByMangaId: { mangaId: [ chapter ] }
export default function chaptersReducer(
  state = { chaptersByMangaId: {}, isFetching: false, error: false },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS:
      return {
        ...state,
        chaptersByMangaId: {
          ...state.chaptersByMangaId,
          ...action.payload,
        },
        isFetching: false,
      };
    case FAILURE:
      return { ...state, isFetching: false, error: true };
    case CACHE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchChapters(mangaId) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST, meta: { mangaId } });

    // Return manga's cached chapters if they're already in the store
    // NOTE: Not checking if the manga's chapters list is empty. (Doing so may possibly cause a bug)
    if (getState().chapters.chaptersByMangaId[mangaId]) {
      return dispatch({ type: CACHE });
    }

    return fetch(Server.chapters(mangaId))
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then(json =>
        // Transform the data for easier use + does not rely on other data in the store
        ({ [mangaId]: json.content }))
      .then(chapters => dispatch({ type: SUCCESS, payload: chapters }));
  };
}
