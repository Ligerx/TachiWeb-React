import { Server } from 'api';
import { ADD_MANGA as ADD_MANGA_TO_LIBRARY } from './library';

// FIXME: reusing isFetching for multiple types of REQUEST which isn't ideal.

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'catalogue/LOAD_REQUEST';
const SUCCESS = 'catalogue/LOAD_SUCCESS';
const FAILURE = 'catalogue/LOAD_FAILURE';
const CACHE = 'catalogue/LOAD_CACHE'; // e.g. Catalogue -> view a manga -> go back to catalogue
const ADD_PAGE_REQUEST = 'catalogue/ADD_PAGE_REQUEST';
const ADD_PAGE_SUCCESS = 'catalogue/ADD_PAGE_SUCCESS';
const ADD_PAGE_FAILURE = 'catalogue/ADD_PAGE_FAILURE';
const ADD_PAGE_NO_NEXT_PAGE = 'catalogue/ADD_PAGE_NO_NEXT_PAGE'; // failsafe, don't use
const FILTERS_REQUEST = 'catalogue/FILTERS_REQUEST';
const FILTERS_SUCCESS = 'catalogue/FILTERS_SUCCESS';
const FILTERS_FAILURE = 'catalogue/FILTERS_FAILURE';

// ================================================================================
// Reducers
// ================================================================================
const initialState = {
  mangaIds: [], // array of mangaIds that point that data loaded in library
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
      // Resetting state except for query and filters
      return {
        ...initialState,
        query: action.query,
        filters: action.filters,
        isFetching: true,
      };
    case SUCCESS: {
      // The rest of the state should be reset from the previous REQUEST action above
      const { mangaIds, hasNextPage } = action;
      return {
        ...state,
        mangaIds,
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
      const { mangaIds, page, hasNextPage } = action;
      return {
        ...state,
        mangaIds: [...state.mangaIds, ...mangaIds],
        page,
        hasNextPage,
        isFetching: false,
      };
    }
    case ADD_PAGE_FAILURE:
      return { ...state, isFetching: false, error: true };
    case ADD_PAGE_NO_NEXT_PAGE: {
      console.error('No next page to fetch. Should not be reaching here');
      return { ...state, isFetching: false, error: true };
    }
    case FILTERS_REQUEST:
      return { ...state, isFetching: true, error: false };
    case FILTERS_SUCCESS:
      return { ...state, filters: action.filters, isFetching: false, error: false };
    case FILTERS_FAILURE:
      return { ...state, isFetching: false, error: true };
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchCatalogue(sourceId, query = '', filters = null) {
  return (dispatch) => {
    dispatch({
      type: REQUEST,
      query,
      filters,
      meta: { sourceId },
    });

    return fetch(Server.catalogue(), cataloguePostParameters(1, sourceId, query.trim(), filters))
      .then(handleServerError)
      .then(
        (json) => {
          const { content, has_next: hasNextPage } = json;
          const mangaIds = transformToMangaIdsArray(content);

          dispatch({ type: ADD_MANGA_TO_LIBRARY, newManga: content });
          dispatch({
            type: SUCCESS,
            mangaIds,
            page: 1,
            hasNextPage,
          });
        },
        error => dispatch({ type: FAILURE, payload: error }),
      );
  };
}

export function fetchNextCataloguePage(sourceId) {
  return (dispatch, getState) => {
    const {
      page, hasNextPage, query, filters,
    } = getState().catalogue;
    const nextPage = page + 1;

    dispatch({
      type: ADD_PAGE_REQUEST,
      meta: {
        sourceId,
        nextPage,
        hasNextPage,
        query,
        filters,
      },
    });

    if (!hasNextPage) {
      return dispatch({ type: ADD_PAGE_NO_NEXT_PAGE });
    }

    return fetch(
      Server.catalogue(),
      cataloguePostParameters(nextPage, sourceId, query.trim(), filters),
    )
      .then(handleServerError)
      .then(
        (json) => {
          const { content, has_next: hasNextPageUpdated } = json;
          const mangaIds = transformToMangaIdsArray(content);

          dispatch({ type: ADD_MANGA_TO_LIBRARY, newManga: content });
          dispatch({
            type: ADD_PAGE_SUCCESS,
            mangaIds,
            page: nextPage,
            hasNextPage: hasNextPageUpdated,
          });
        },
        error => dispatch({ type: ADD_PAGE_FAILURE, payload: error }),
      );
  };
}

export function fetchFilters(sourceId) {
  return (dispatch) => {
    dispatch({ type: FILTERS_REQUEST, meta: { sourceId } });

    return fetch(Server.filters(sourceId))
      .then(res => res.json(), error => dispatch({ type: FILTERS_FAILURE, error }))
      .then(json => dispatch({ type: FILTERS_SUCCESS, filters: json.content }));
  };
}

// ================================================================================
// Helper Functions
// ================================================================================
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

function transformToMangaIdsArray(mangaArray) {
  return mangaArray.map(manga => manga.id);
}
