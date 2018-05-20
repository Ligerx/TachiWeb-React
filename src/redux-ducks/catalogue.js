import { Server } from 'api';
import { CLEAR_FILTERS } from './filters';
import { ADD_MANGA } from './mangaInfos';

// ================================================================================
// Actions
// ================================================================================
const RESET_STATE = 'catalogue/RESET_STATE';

const FETCH_CATALOGUE_REQUEST = 'catalogue/FETCH_REQUEST';
const FETCH_CATALOGUE_SUCCESS = 'catalogue/FETCH_SUCCESS';
const FETCH_CATALOGUE_FAILURE = 'catalogue/FETCH_FAILURE';
export const FETCH_CATALOGUE = 'catalogue/FETCH';

const ADD_PAGE_NO_NEXT_PAGE = 'catalogue/ADD_PAGE_NO_NEXT_PAGE'; // failsafe, don't use
const ADD_PAGE_REQUEST = 'catalogue/ADD_PAGE_REQUEST';
const ADD_PAGE_SUCCESS = 'catalogue/ADD_PAGE_SUCCESS';
const ADD_PAGE_FAILURE = 'catalogue/ADD_PAGE_FAILURE';
export const CATALOGUE_ADD_PAGE = 'catalogue/ADD_PAGE';

// ================================================================================
// Reducers
// ================================================================================
const initialState = {
  mangaIds: [], // array of mangaIds that point that data loaded in mangaInfos reducer
  page: 1, // TODO: can possibly move this out of redux and into the component state? Not sure.
  hasNextPage: false,
};

export default function chaptersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case RESET_STATE:
      return initialState;

    case FETCH_CATALOGUE_SUCCESS: {
      const { mangaIds, hasNextPage } = action;
      return {
        ...state,
        mangaIds,
        hasNextPage,
      };
    }

    case ADD_PAGE_SUCCESS: {
      const { mangaIds, page, hasNextPage } = action;
      return {
        ...state,
        mangaIds: [...state.mangaIds, ...mangaIds],
        page,
        hasNextPage,
      };
    }

    case ADD_PAGE_NO_NEXT_PAGE: {
      console.error('No next page to fetch. Should not be reaching here');
      return state;
    }
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
export function fetchCatalogue(
  sourceId,
  query = '',
  filters = null,
  { retainFilters = false } = {}, // optionally keep previous initialFilters
) {
  return (dispatch) => {
    dispatch({ type: RESET_STATE });
    dispatch({
      type: FETCH_CATALOGUE_REQUEST,
      meta: { sourceId, query, filters },
    });

    if (!retainFilters) {
      // TODO: Not sure if this should be here?
      //       possibly remove it and place a clearFilters action for the page to call?
      //       not sure if that's better or worse
      dispatch({ type: CLEAR_FILTERS });
    }

    return fetch(Server.catalogue(), cataloguePostParameters(1, sourceId, query.trim(), filters))
      .then(handleServerError)
      .then(
        (json) => {
          const { content, has_next: hasNextPage } = json;
          const mangaIds = transformToMangaIdsArray(content);

          dispatch({ type: ADD_MANGA, newManga: content });
          dispatch({
            type: FETCH_CATALOGUE_SUCCESS,
            mangaIds,
            page: 1,
            hasNextPage,
          });
        },
        error =>
          dispatch({
            type: FETCH_CATALOGUE_FAILURE,
            errorMessage: 'Failed to load this catalogue',
            meta: { error },
          }),
      );
  };
}

export function fetchNextCataloguePage(sourceId, query = '', filters = null) {
  return (dispatch, getState) => {
    const { page, hasNextPage } = getState().catalogue;
    const nextPage = page + 1;

    if (!hasNextPage) {
      return dispatch({ type: ADD_PAGE_NO_NEXT_PAGE });
    }

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

    return fetch(
      Server.catalogue(),
      cataloguePostParameters(nextPage, sourceId, query.trim(), filters),
    )
      .then(handleServerError)
      .then(
        (json) => {
          const { content, has_next: hasNextPageUpdated } = json;
          const mangaIds = transformToMangaIdsArray(content);

          dispatch({ type: ADD_MANGA, newManga: content });
          dispatch({
            type: ADD_PAGE_SUCCESS,
            mangaIds,
            page: nextPage,
            hasNextPage: hasNextPageUpdated,
          });
        },
        error =>
          dispatch({
            type: ADD_PAGE_FAILURE,
            errorMessage: 'There was a problem loading the next page of manga',
            meta: { error },
          }),
      );
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
