import { Server } from 'api';

// FIXME: reusing isFetching for ADD_PAGE_..., which isn't ideal.

// Actions
const REQUEST = 'catalogue/LOAD_REQUEST';
const RESET_STATE = 'catalogue/LOAD_RESET_STATE';
const SUCCESS = 'catalogue/LOAD_SUCCESS';
const FAILURE = 'catalogue/LOAD_FAILURE';
const CACHE = 'catalogue/LOAD_CACHE'; // e.g. Catalogue -> view a manga -> go back to catalogue
const ADD_PAGE_REQUEST = 'catalogue/ADD_PAGE_REQUEST';
const ADD_PAGE_SUCCESS = 'catalogue/ADD_PAGE_SUCCESS';
const ADD_PAGE_FAILURE = 'catalogue/ADD_PAGE_FAILURE';
// Don't use ADD_PAGE_NO_NEXT_PAGE, check before calling fetchMoreCataloguePages
// Keeping it as a failsafe
const ADD_PAGE_NO_NEXT_PAGE = 'catalogue/ADD_PAGE_NO_NEXT_PAGE';

// Reducers
const initialState = {
  mangaLibrary: [], // keep an array of mangas just for catalogue
  page: 1,
  hasNextPage: false,
  query: '',
  filters: null,
  isFetching: false,
  error: false,
};

export default function chaptersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case RESET_STATE: {
      // Overriding all of catalogue state on request when fetching fresh catalogue data
      const { query, filters } = action;
      return {
        ...initialState,
        query,
        filters,
      };
    }
    case SUCCESS: {
      // Other state should be up to date from the previous REQUEST action above
      const { mangaLibrary, hasNextPage } = action;
      return {
        ...state,
        mangaLibrary,
        hasNextPage,
        isFetching: false,
      };
    }
    case FAILURE:
      return { ...state, isFetching: false, error: true };
    case CACHE:
      return { ...state, isFetching: false };
    case ADD_PAGE_REQUEST:
      return { ...state, isFetching: true, error: false };
    case ADD_PAGE_SUCCESS: {
      const { page, hasNextPage, additionalManga } = action;
      return {
        ...state,
        page,
        hasNextPage,
        mangaLibrary: [...state.mangaLibrary, ...additionalManga],
      };
    }
    case ADD_PAGE_FAILURE:
      return { ...state, isFetching: false, error: true };
    case ADD_PAGE_NO_NEXT_PAGE:
      return { ...state, isFetching: false };
    default:
      return state;
  }
}

// Action Creators
export function fetchCatalogue(sourceId, query = '', filters = null) {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST });

    // Return cached catalogue data assuming you just want to see old results
    if (
      getState().catalogue.sourceId === sourceId &&
      getState().catalogue.query === query &&
      getState().catalogue.filters === filters
    ) {
      return dispatch({ type: CACHE });
    }

    // Clear previous data before initiating fetch
    dispatch({
      type: RESET_STATE,
      query,
      filters,
    });

    return fetch(Server.catalogue(), cataloguePostParameters(1, sourceId, query, filters))
      .then(handleServerError)
      .then(
        (json) => {
          const { content, has_next: hasNextPage } = json;

          dispatch({
            type: SUCCESS,
            page: 1,
            mangaLibrary: content,
            hasNextPage,
          });
        },
        error => dispatch({ type: FAILURE, payload: error }),
      );
  };
}

export function fetchMoreCataloguePages(sourceId) {
  return (dispatch, getState) => {
    dispatch({ type: ADD_PAGE_REQUEST });

    const {
      page, hasNextPage, query, filters,
    } = getState().catalogue;
    const nextPage = page + 1;

    if (!hasNextPage) {
      return dispatch({ type: ADD_PAGE_NO_NEXT_PAGE });
    }

    return fetch(Server.catalogue(), cataloguePostParameters(nextPage, sourceId, query, filters))
      .then(handleServerError)
      .then(
        (json) => {
          const { content, has_next: hasNextPageUpdated } = json;

          dispatch({
            type: ADD_PAGE_SUCCESS,
            page: nextPage,
            hasNextPage: hasNextPageUpdated,
            additionalManga: content,
          });
        },
        error => dispatch({ type: ADD_PAGE_FAILURE, payload: error }),
      );
  };
}

// Probably need another action specifically for getting the next page of results
// and adding them to library and catalogue
// Or I could make fetchCatalogue deal with these different cases?

// Helper functions
function cataloguePostParameters(page, sourceId, query, filters) {
  return {
    method: 'POST',
    body: JSON.stringify({
      page,
      sourceId,
      query,
      filters,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  };
}

function handleServerError(res) {
  // NOTE: This should be used in tandem with a Promise

  // Kissmanga error would return <html><body><h2>500 Internal Error</h2></body></html>
  // This is not JSON, and causes a crash with the error handler.
  // I have to manually handle the error =(

  if (res.status === 500) {
    // Server Error occurred, html returned. Throw error.
    return Promise.reject(new Error('500 Server Error encountered when trying to fetch catalogue'));
  }
  return res.json();
}
