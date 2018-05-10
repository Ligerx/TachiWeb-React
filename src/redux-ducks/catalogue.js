import { Server } from 'api';
import { ADD_MANGA as LIBRARY_ADD_MANGA } from './library';

// Actions
const REQUEST = 'catalogue/LOAD_REQUEST';
const SUCCESS = 'catalogue/LOAD_SUCCESS';
const FAILURE = 'catalogue/LOAD_FAILURE';
const CACHE = 'catalogue/LOAD_CACHE'; // e.g. Catalogue -> view a manga -> go back to catalogue

// Reducers
export default function chaptersReducer(
  state = {
    mangaIds: [],
    page: 1,
    hasNextPage: false,
    query: '',
    filters: null,
    isFetching: false,
    error: false,
  },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS: {
      const {
        mangaIds, page, hasNextPage, query, filters,
      } = action;
      return {
        ...state,
        mangaIds,
        page,
        hasNextPage,
        query,
        filters,
        isFetching: false,
      };
    }
    case FAILURE:
      return { ...state, isFetching: false, error: true };
    case CACHE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}

// Action Creators
export function fetchCatalogue(sourceId, page, query = '', filters = null) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST });

    // Return cached catalogue data assuming you just want to see old results
    if (
      getState().sourceId === sourceId &&
      getState().query === query &&
      getState().filters === filters &&
      getState().page === page // <- not sure if this is correct
    ) {
      return dispatch({ type: CACHE });
    }

    return (
      fetch(Server.catalogue(), {
        method: 'POST',
        body: JSON.stringify({
          sourceId,
          page,
          query,
          filters,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        // Kissmanga error would return <html><body><h2>500 Internal Error</h2></body></html>
        // This is not JSON, and causes a crash with the error handler.
        // I have to manually handle the error =(
        .then((res) => {
          if (res.status === 500) {
            // Server Error occurred, html returned. Throw error.
            return Promise.reject(new Error('500 Server Error encountered when trying to fetch catalogue'));
          }
          return res.json();
        })
        .then(
          (json) => {
            const { content, has_next: hasNextPage } = json;
            const mangaIds = content.map(mangaInfo => mangaInfo.id);

            dispatch({
              type: SUCCESS,
              mangaIds,
              page,
              hasNextPage,
              query,
              filters,
            });
            dispatch({ type: LIBRARY_ADD_MANGA, newManga: content });
          },
          error => dispatch({ type: FAILURE, payload: error }),
        )
    );
  };
}

// Probably need another action specifically for getting the next page of results
// and adding them to library and catalogue
// Or I could make fetchCatalogue deal with these different cases?
