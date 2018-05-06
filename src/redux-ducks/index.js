import { combineReducers } from 'redux';
import library from './library';
import chapters from './chapters';

export default combineReducers({
  library,
  chapters,
});
