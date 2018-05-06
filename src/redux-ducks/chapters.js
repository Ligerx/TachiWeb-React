import { Server } from 'api';

// Actions
const REQUEST = 'chapters/LOAD_REQUEST';
const SUCCESS = 'chapters/LOAD_SUCCESS';
const FAILURE = 'chapters/LOAD_FAILURE';

// Reducers
export default function chaptersReducer(
  state = { chapters: {}, isFetching: false, error: false },
  action = {},
) {
  switch (action.type) {
    case REQUEST:
      return { ...state, isFetching: true, error: false };
    case SUCCESS:
      return {
        ...state,
        chapters: {
          ...state.chapters,
          ...action.payload,
        },
        isFetching: false,
      };
    case FAILURE:
      return { ...state, isFetching: false, error: true };
    default:
      return state;
  }
}

// Action Creators
export function fetchChapters(mangaId) {
  return (dispatch) => {
    dispatch({ type: REQUEST });

    return fetch(Server.chapters(mangaId))
      .then(res => res.json(), error => dispatch({ type: FAILURE, payload: error }))
      .then((json) => {
        // Transform the data for easier use
        // [{ chapter }] becomes -> { mangaId: [{ chapter }] }
        const chapters = {};
        json.content.forEach((chapter) => {
          chapters[chapter.id] = chapter;
        });
        return chapters;
      })
      .then(chapters => dispatch({ type: SUCCESS, payload: chapters }));
  };
}
