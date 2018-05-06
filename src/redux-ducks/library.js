import { Server } from 'api';

// Actions
const REQUEST = 'library/LOAD_REQUEST';
const SUCCESS = 'library/LOAD_SUCCESS';
const FAILURE = 'library/LOAD_FAILURE';
const TOGGLE_FAVORITE_REQUEST = 'library/TOGGLE_FAVORITE_REQUEST';
const TOGGLE_FAVORITE_SUCCESS = 'library/TOGGLE_FAVORITE_SUCCESS';
const TOGGLE_FAVORITE_FAILURE = 'library/TOGGLE_FAVORITE_FAILURE';

// Helper functions
// Clone the mangaLibrary and toggle the one manga's favorite status
function toggleFavoriteInLibrary(mangaLibrary, mangaId) {
  return mangaLibrary.map((manga) => {
    if (manga.id === mangaId) {
      return { ...manga, favorite: !manga.favorite };
    }
    return { ...manga };
  });
}

// Reducers

// TODO: remove 'error' flag when error is fixed? Is there a more efficient way to do this?
export default function libraryReducer(
  state = {
    mangaLibrary: [],
    isFetching: false,
    error: false,
    isTogglingFavorite: false,
  },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS:
      return { ...state, mangaLibrary: action.payload, isFetching: false };
    case FAILURE:
      // Don't over write existing manga in store if an error happens
      // FIXME: error payload? error boolean? what do.
      console.error(action.payload);
      return { ...state, isFetching: false, error: true };
    case TOGGLE_FAVORITE_REQUEST:
      return { ...state, isTogglingFavorite: true };
    case TOGGLE_FAVORITE_SUCCESS:
      return {
        ...state,
        mangaLibrary: toggleFavoriteInLibrary(state.mangaLibrary, action.mangaId),
        isTogglingFavorite: false,
      };
    case TOGGLE_FAVORITE_FAILURE:
      console.error(action.payload);
      return { ...state, isTogglingFavorite: false, error: true };
    default:
      return state;
  }
}

// Action Creators
export function fetchLibrary() {
  return (dispatch, getState) => {
    // Return cached data if it's in the store
    // TODO: make sure this is working
    // TODO: maybe create an action to show that info was pulled from the cache???
    if (getState().library.mangaLibrary.length > 0) {
      return null;
    }

    dispatch({ type: REQUEST });

    return fetch(Server.library())
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then(json => dispatch({ type: SUCCESS, payload: json.content }));
  };
}

export function toggleFavorite(mangaId) {
  return (dispatch, getState) => {
    dispatch({ type: TOGGLE_FAVORITE_REQUEST });

    const mangaInfo = getState().library.mangaLibrary.find(manga => manga.id === parseInt(mangaId, 10));
    // TODO: error handling, what if manga not found

    return fetch(Server.toggleFavorite(mangaInfo.id, mangaInfo.favorite)).then(
      () => dispatch({ type: TOGGLE_FAVORITE_SUCCESS, mangaId: mangaInfo.id }),
      () => dispatch({ type: TOGGLE_FAVORITE_FAILURE, payload: 'Failed to toggle favorite' }),
    );
  };
}
