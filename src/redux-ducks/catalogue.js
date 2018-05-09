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
    query: null,
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
export function fetchCatalogue(sourceId, page, query = null, filters = null) {
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

    return fetch(Server.catalogue(), {
      method: 'POST',
      body: {
        sourceId,
        page,
        query,
        filters,
      },
    })
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then((json) => {
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
      });
  };
}
