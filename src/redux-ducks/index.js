import { combineReducers } from 'redux';
import library from './library';
import chapters from './chapters';
import pageCounts from './pageCounts';

export default combineReducers({
  library,
  chapters,
  pageCounts,
});
