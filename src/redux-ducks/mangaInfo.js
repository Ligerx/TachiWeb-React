import { Server } from 'api';

// ================================================================================
// Actions
// ================================================================================
const REQUEST = 'mangaInfo/LOAD_REQUEST';
const SUCCESS = 'mangaInfo/LOAD_SUCCESS';
const FAILURE = 'mangaInfo/LOAD_FAILURE';

export const ADD_MANGA = 'mangaInfo/ADD_MANGA';

// ================================================================================
// Reducers
// ================================================================================
export default function mangaInfoReducer(state = {}, action = {}) {
  switch (action.type) {
    case ADD_MANGA:
      return { ...state, ...mangaArrayToObject(action.newManga) };
    default:
      return state;
  }
}

// ================================================================================
// Action Creators
// ================================================================================
function mangaArrayToObject(mangaArray) {
  const mangaObject = {};
  mangaArray.forEach((manga) => {
    mangaObject[manga.id] = manga;
  });
  return mangaObject;
}
