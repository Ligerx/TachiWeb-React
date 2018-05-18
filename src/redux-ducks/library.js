import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'library/LOAD_REQUEST';
const SUCCESS = 'library/LOAD_SUCCESS';
const FAILURE = 'library/LOAD_FAILURE';
const CACHE = 'library/LOAD_CACHE';

const TOGGLE_FAVORITE_REQUEST = 'library/TOGGLE_FAVORITE_REQUEST';
const TOGGLE_FAVORITE_SUCCESS = 'library/TOGGLE_FAVORITE_SUCCESS';
const TOGGLE_FAVORITE_FAILURE = 'library/TOGGLE_FAVORITE_FAILURE';

const UPDATE_REQUEST = 'library/UPDATE_REQUEST';
const UPDATE_SUCCESS = 'library/UPDATE_SUCCESS';
const UPDATE_FAILURE = 'library/UPDATE_FAILURE';

const GET_UNREAD_REQUEST = 'library/GET_UNREAD_REQUEST';
const GET_UNREAD_SUCCESS = 'library/GET_UNREAD_SUCCESS';
const GET_UNREAD_FAILURE = 'library/GET_UNREAD_FAILURE';
const GET_UNREAD_CACHE = 'library/GET_UNREAD_CACHE';
const UNREAD_NEEDS_RELOAD = 'library/UNREAD_NEEDS_RELOAD';

const ADD_MANGA = 'library/ADD_MANGA';
export { ADD_MANGA };

// ================================================================================
// Reducers
// ================================================================================

// TODO: remove 'error' flag when error is fixed? Is there a more efficient way to do this?
export default function libraryReducer(
  state = {
    mangaLibrary: [],
    isFetching: false,
    error: false,
    isTogglingFavorite: false,
    // Force load library data if it hasn't been requested before. (not catalogue data)
    libraryLoaded: false,
    unread: {}, // { mangaId: int }
    reloadUnread: true, // should refresh unread for library if something new is added
  },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS:
      return {
        ...state,
        mangaLibrary: action.payload,
        isFetching: false,
        libraryLoaded: true,
      };
    case FAILURE:
      // FIXME: error payload? error boolean? what do.
      console.error(action.payload);
      return { ...state, isFetching: false, error: true };
    case CACHE:
      return { ...state, isFetching: false };
    case TOGGLE_FAVORITE_REQUEST:
      return { ...state, isTogglingFavorite: true };
    case TOGGLE_FAVORITE_SUCCESS: {
      const newMangaLibrary = toggleFavoriteInLibrary(state.mangaLibrary, action.mangaId);

      return {
        ...state,
        mangaLibrary: newMangaLibrary,
        isTogglingFavorite: false,
      };
    }
    case TOGGLE_FAVORITE_FAILURE:
      console.error(action.payload);
      return { ...state, isTogglingFavorite: false, error: true };
    case UPDATE_REQUEST:
      return { ...state, isFetching: true, error: false };
    case UPDATE_SUCCESS:
      return {
        ...state,
        mangaLibrary: replaceMangaInfo(state.mangaLibrary, action.mangaInfo),
        isFetching: false,
      };
    case UPDATE_FAILURE:
      return { ...state, isFetching: false, error: true };
    case GET_UNREAD_REQUEST:
      return { ...state, isFetching: true, error: false };
    case GET_UNREAD_SUCCESS:
      return {
        ...state,
        unread: action.unread,
        reloadUnread: false,
        isFetching: false,
      };
    case GET_UNREAD_FAILURE:
      return { ...state, isFetching: false, error: true };
    case GET_UNREAD_CACHE:
      return { ...state, isFetching: false };
    case UNREAD_NEEDS_RELOAD:
      return { ...state, reloadUnread: true };
    case ADD_MANGA: {
      return {
        ...state,
        mangaLibrary: addToMangaLibrary(state.mangaLibrary, action.newManga),
      };
    }
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchLibrary({ ignoreCache = false } = {}) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST });

    // Return cached mangaLibrary if it's been loaded before
    if (!ignoreCache && getState().library.libraryLoaded) {
      return dispatch({ type: CACHE });
    }

    return fetch(Server.library())
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then(json => dispatch({ type: SUCCESS, payload: json.content }));
  };
}

export function toggleFavorite(mangaId, isCurrentlyFavorite) {
  return (dispatch) => {
    dispatch({ type: TOGGLE_FAVORITE_REQUEST, meta: { mangaId, isCurrentlyFavorite } });

    return fetch(Server.toggleFavorite(mangaId, isCurrentlyFavorite)).then(
      () => {
        if (!isCurrentlyFavorite) {
          dispatch({ type: UNREAD_NEEDS_RELOAD });
        }

        return dispatch({
          type: TOGGLE_FAVORITE_SUCCESS,
          mangaId,
          meta: { newIsFavorite: !isCurrentlyFavorite },
        });
      },
      () => dispatch({ type: TOGGLE_FAVORITE_FAILURE, payload: 'Failed to toggle favorite' }),
    );
  };
}

export function updateMangaInfo(mangaId) {
  return (dispatch) => {
    dispatch({ type: UPDATE_REQUEST, meta: { mangaId } });

    return fetch(Server.mangaInfo(mangaId))
      .then(res => res.json(), error => dispatch({ type: UPDATE_FAILURE, payload: error }))
      .then(json => dispatch({ type: UPDATE_SUCCESS, mangaInfo: json.content }));
  };
}

export function fetchUnread() {
  return (dispatch, getState) => {
    dispatch({ type: GET_UNREAD_REQUEST });

    if (!getState().library.reloadUnread) {
      return dispatch({ type: GET_UNREAD_CACHE });
    }

    return fetch(Server.libraryUnread())
      .then(res => res.json(), error => dispatch({ type: GET_UNREAD_FAILURE, payload: error }))
      .then(json => dispatch({ type: GET_UNREAD_SUCCESS, unread: transformUnread(json.content) }));
  };
}

// ================================================================================
// Helper functions
// ================================================================================

// Clone the mangaLibrary and toggle the one manga's favorite status
function toggleFavoriteInLibrary(mangaLibrary, mangaId) {
  return mangaLibrary.map((manga) => {
    if (manga.id === mangaId) {
      return { ...manga, favorite: !manga.favorite };
    }
    return manga;
  });
}

function addToMangaLibrary(currentMangaLibrary, newMangaLibrary) {
  // Possibly really inefficient? Not sure if it'll cause performance issues.
  const filteredManga = currentMangaLibrary.filter((manga) => {
    if (newMangaLibrary.find(newManga => manga.id === newManga.id)) {
      return false;
    }
    return true;
  });

  return [...filteredManga, ...newMangaLibrary];
}

function replaceMangaInfo(mangaLibrary, newMangaInfo) {
  const index = mangaLibrary.findIndex(manga => manga.id === newMangaInfo.id);

  return [...mangaLibrary.slice(0, index), newMangaInfo, ...mangaLibrary.slice(index + 1)];
}

function transformUnread(unreadArray) {
  // [ { id: number, unread: number } ] -> { mangaId: unread }
  const newUnread = {};
  unreadArray.forEach((unreadObj) => {
    newUnread[unreadObj.id] = unreadObj.unread;
  });
  return newUnread;
}
