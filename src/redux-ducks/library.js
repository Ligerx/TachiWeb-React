import { Server } from 'api';
import { TOGGLE_FAVORITE as TOGGLE_FAVORITE_CATALOGUE } from './catalogue';

// Actions
const REQUEST = 'library/LOAD_REQUEST';
const SUCCESS = 'library/LOAD_SUCCESS';
const FAILURE = 'library/LOAD_FAILURE';
const CACHE = 'library/LOAD_CACHE';
const TOGGLE_FAVORITE_REQUEST = 'library/TOGGLE_FAVORITE_REQUEST';
const TOGGLE_FAVORITE_SUCCESS = 'library/TOGGLE_FAVORITE_SUCCESS';
const TOGGLE_FAVORITE_FAILURE = 'library/TOGGLE_FAVORITE_FAILURE';

// Reducers

// TODO: remove 'error' flag when error is fixed? Is there a more efficient way to do this?
export default function libraryReducer(
  state = {
    mangaLibrary: [],
    isFetching: false,
    error: false,
    isTogglingFavorite: false,
    // prevent using cached data and force a new fetch when true
    // default to true so library loads even when catalogue has loaded data into mangalibrary
    staleData: true,
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
        staleData: false,
      };
    case FAILURE:
      // Don't over write existing manga in store if an error happens
      // FIXME: error payload? error boolean? what do.
      console.error(action.payload);
      return { ...state, isFetching: false, error: true };
    case CACHE:
      return { ...state, isFetching: false };
    case TOGGLE_FAVORITE_REQUEST:
      return { ...state, isTogglingFavorite: true };
    case TOGGLE_FAVORITE_SUCCESS: {
      const { staleData } = state;
      const { isFavoriting, newMangaLibrary } = toggleFavoriteInLibrary(
        state.mangaLibrary,
        action.mangaId,
      );

      let newState = {
        ...state,
        mangaLibrary: newMangaLibrary,
        isTogglingFavorite: false,
      };

      // only turn on staleData if it's currently off
      if (!staleData && isFavoriting) {
        newState = { ...newState, staleData: true };
      }
      return newState;
    }
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
    dispatch({ type: REQUEST });

    // Return cached mangaLibrary if it's in the store. Ignore cache if staleData true
    const { mangaLibrary, staleData } = getState().library;
    if (!staleData && mangaLibrary.length > 0) {
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

    // Not checking if the manga exists in the library because if you're favoriting
    // from the catalogue, the library data may not have been loaded yet.

    return fetch(Server.toggleFavorite(mangaId, isCurrentlyFavorite)).then(
      () => {
        // Additionally toggle favorite in catalogue if it exists.
        dispatch({ type: TOGGLE_FAVORITE_CATALOGUE, mangaId });

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

// Helper functions
// Clone the mangaLibrary and toggle the one manga's favorite status
function toggleFavoriteInLibrary(mangaLibrary, mangaId) {
  let isFavoriting = false; // tracking if a manga is being added to favorites
  const newMangaLibrary = mangaLibrary.map((manga) => {
    if (manga.id === mangaId) {
      isFavoriting = !manga.favorite;
      return { ...manga, favorite: !manga.favorite };
    }
    return { ...manga };
  });

  return { isFavoriting, newMangaLibrary };
}
