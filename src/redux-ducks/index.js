import { combineReducers } from 'redux';
import library from './library';
import chapters from './chapters';
import pageCounts from './pageCounts';
import catalogue from './catalogue';

export default combineReducers({
  library,
  chapters,
  pageCounts,
  catalogue,
});
