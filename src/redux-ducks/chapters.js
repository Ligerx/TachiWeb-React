import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'chapters/LOAD_REQUEST';
const SUCCESS = 'chapters/LOAD_SUCCESS';
const FAILURE = 'chapters/LOAD_FAILURE';
const CACHE = 'chapters/LOAD_CACHE';
const UPDATE_REQUEST = 'chapters/UPDATE_REQUEST';
const UPDATE_SUCCESS = 'chapters/UPDATE_SUCCESS';
const UPDATE_FAILURE = 'chapters/UPDATE_FAILURE';

// ================================================================================
// Reducers
// ================================================================================

// TODO: right now state is chapters.chapters{ mangaId: [chapter] }, which is confusing.
//       I'd love to rename chapters.chapters to something that makes more sense.
//
//       Update: call it chapters.chaptersByMangaId
//       chaptersByMangaId: { mangaId: [ chapter ] }

// FIXME: reusing isFetching for multiple types of actions, not great.

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
          ...state.chaptersByMangaId, // FIXME: I think this will combine old and new chapters, incorrect.
          ...action.payload,
        },
        isFetching: false,
      };
    case FAILURE:
      return { ...state, isFetching: false, error: true };
    case CACHE:
      return { ...state, isFetching: false };
    case UPDATE_REQUEST:
      return { ...state, isFetching: true, error: false };
    case UPDATE_SUCCESS:
      return { ...state, isFetching: false, error: false };
    case UPDATE_FAILURE:
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchChapters(mangaId, { ignoreCache = false } = {}) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST, meta: { mangaId } });

    // Return manga's cached chapters if they're already in the store
    // NOTE: Not checking if the manga's chapters list is empty. (Doing so may possibly cause a bug)
    if (!ignoreCache && getState().chapters.chaptersByMangaId[mangaId]) {
      // A bit of a hack I guess. Return a promise so that any function calling fetchChapters
      // can use .then() whether we dispatch cached data or fetch from the server.
      return Promise.resolve().then(dispatch({ type: CACHE }));
    }

    return fetch(Server.chapters(mangaId))
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then(json =>
        // Transform the data for easier use + does not rely on other data in the store
        ({ [mangaId]: json.content }))
      .then(chapters => dispatch({ type: SUCCESS, payload: chapters }));
  };
}

export function updateChapters(mangaId) {
  return (dispatch) => {
    dispatch({ type: UPDATE_REQUEST, meta: { mangaId } });

    return fetch(Server.updateMangaChapters(mangaId))
      .then(res => res.json(), error => dispatch({ type: UPDATE_FAILURE, payload: error }))
      .then((json) => {
        if (!json.success) {
          return dispatch({ type: UPDATE_FAILURE, meta: { json } });
        }

        if (json.added.length > 0 || json.removed.length > 0) {
          dispatch({ type: UPDATE_SUCCESS, meta: { json } });
          return dispatch(fetchChapters(mangaId, { ignoreCache: true }));
        }

        return dispatch({ type: UPDATE_SUCCESS, meta: { json } });
      });
  };
}
